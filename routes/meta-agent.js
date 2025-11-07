import express from 'express';

const router = express.Router();

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'techminds-academy-meta-verify-token';
const META_USER_ACCESS_TOKEN = process.env.META_USER_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

const KNOWLEDGE_BASE = [
  {
    keywords: ['hello', 'hi', 'hey'],
    response:
      "Hello! I'm the Techminds Academy AI tutor. How can I help you explore technology learning opportunities today?"
  },
  {
    keywords: ['location', 'where'],
    response:
      'Techminds Academy is located in Bwari, Abuja. We run both in-person and virtual sessions so you can learn from anywhere.'
  },
  {
    keywords: ['course', 'program', 'class', 'bootcamp'],
    response:
      'We offer immersive courses in cloud computing, data science, cybersecurity, software engineering, and product design. Let me know which area excites you!'
  },
  {
    keywords: ['price', 'cost', 'fee', 'tuition', 'scholarship'],
    response:
      'Our tuition plans are flexible with installment options and periodic scholarships. Share the programme you are interested in so I can send the specific fees.'
  },
  {
    keywords: ['enrol', 'enroll', 'register', 'apply', 'admission'],
    response:
      'To join Techminds Academy, complete the online application at https://techmindsacademy.org/apply and our admissions team will guide you through onboarding.'
  },
  {
    keywords: ['contact', 'support', 'phone'],
    response:
      'You can reach our support team via hello@techmindsacademy.org or call +234-706-060-1131 for quick assistance.'
  },
  {
    keywords: ['career', 'job', 'internship'],
    response:
      'Our career studio provides mentorship, portfolio reviews, and connects you to internships with partner companies. Ask me for the latest opportunities.'
  },
  {
    keywords: ['schedule', 'time', 'duration', 'weeks'],
    response:
      'Most bootcamps last 12 weeks with evening and weekend tracks designed for both students and working professionals.'
  },
  {
    keywords: ['ai', 'machine learning', 'artificial intelligence'],
    response:
      'Our AI and machine learning modules cover Python, data pipelines, model training, and practical deployment projects guided by mentors.'
  }
];

const FALLBACK_RESPONSES = [
  "I'm here to answer tech questions for Techminds Academy. Ask me about courses, career paths, or any topic in technology!",
  "That sounds exciting! Could you give me more details so I can guide you better?",
  "Techminds Academy blends hands-on labs with mentoring. Tell me what you want to build and I'll show you the path."
];

function pickFallbackResponse() {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

function generateAgentReply(messageText = '') {
  const cleanText = messageText.trim().toLowerCase();

  if (!cleanText) {
    return "Hi! I'm the Techminds Academy tutor bot. How can I support your tech learning journey today?";
  }

  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some((keyword) => cleanText.includes(keyword))) {
      return item.response;
    }
  }

  if (cleanText.includes('who are you') || cleanText.includes('your name')) {
    return "I'm Techminds Academy's AI tutor, built to answer questions about our programmes and support your tech growth.";
  }

  if (cleanText.includes('help') || cleanText.includes('assist')) {
    return "I'm ready to help with tech topics, admissions guidance, and personalised learning plans for Techminds Academy.";
  }

  return pickFallbackResponse();
}

async function callMetaApi(endpoint, payload) {
  if (!META_USER_ACCESS_TOKEN) {
    console.warn('META_USER_ACCESS_TOKEN is missing. Unable to respond to the user.');
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${META_USER_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Meta API error:', response.status, errorBody);
    }
  } catch (error) {
    console.error('Failed to call Meta API:', error);
  }
}

async function sendWhatsappReply(target, message) {
  const phoneNumberId = WHATSAPP_PHONE_NUMBER_ID || target?.phone_number_id;

  if (!phoneNumberId) {
    console.warn('WHATSAPP_PHONE_NUMBER_ID is missing. Unable to send WhatsApp replies.');
    return;
  }

  if (!target?.recipient) {
    console.warn('No WhatsApp recipient found in the incoming payload.');
    return;
  }

  const endpoint = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: target.recipient,
    type: 'text',
    text: {
      body: message
    }
  };

  await callMetaApi(endpoint, payload);
}

async function sendMessengerReply(recipientId, message) {
  const endpoint = 'https://graph.facebook.com/v18.0/me/messages';

  const payload = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId
    },
    message: {
      text: message
    }
  };

  await callMetaApi(endpoint, payload);
}

async function handleWhatsappChange(change) {
  const value = change.value || {};
  const messages = value.messages || [];
  const contacts = value.contacts || [];

  if (!messages.length || !contacts.length) {
    return;
  }

  const message = messages[0];
  const contact = contacts[0];

  let incomingText = '';

  if (message.type === 'text' && message.text?.body) {
    incomingText = message.text.body;
  } else if (message.type === 'interactive') {
    const interactive = message.interactive || {};
    incomingText = interactive.text || interactive.title || '';
  }

  if (!incomingText) {
    return;
  }

  const reply = generateAgentReply(incomingText);

  await sendWhatsappReply(
    {
      phone_number_id: value.metadata?.phone_number_id,
      recipient: contact.wa_id
    },
    reply
  );
}

async function handleMessengerEvent(event) {
  if (!event.message || event.message.is_echo) {
    return;
  }

  const senderId = event.sender?.id;
  const text = event.message.text;

  if (!senderId || !text) {
    return;
  }

  const reply = generateAgentReply(text);

  await sendMessengerReply(senderId, reply);
}

async function handleEntry(entry) {
  const changes = entry.changes || [];
  const messagingEvents = entry.messaging || [];

  const handlers = [];

  for (const change of changes) {
    if (change.field === 'messages' || change.field === 'whatsapp_business_account') {
      handlers.push(handleWhatsappChange(change));
    }
  }

  for (const event of messagingEvents) {
    handlers.push(handleMessengerEvent(event));
  }

  await Promise.allSettled(handlers);
}

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

router.post('/webhook', async (req, res) => {
  const entries = req.body.entry || [];

  await Promise.allSettled(entries.map((entry) => handleEntry(entry)));

  res.sendStatus(200);
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    business: 'Techminds Academy AI Agent',
    whatsappConfigured: Boolean(WHATSAPP_PHONE_NUMBER_ID),
    metaTokenPresent: Boolean(META_USER_ACCESS_TOKEN)
  });
});

export default router;
