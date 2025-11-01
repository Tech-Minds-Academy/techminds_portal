import express from 'express';

const router = express.Router();

const newsItems = [
  {
    id: 1,
    title: 'Cloud Computing Bootcamp Begins 15th July',
    summary: 'Kick off Module 3 with industry mentors, hands-on labs, and a live hackathon weekend.',
    category: 'Events',
    date: '2024-07-01T08:00:00.000Z',
    link: 'https://techmindsacademy.org/blog/cloud-bootcamp',
    linkLabel: 'See bootcamp schedule',
    linkType: 'external'
  },
  {
    id: 2,
    title: 'Scholarship Applications Close Soon',
    summary: 'Submit supporting documents by 5 July to be considered for the Impact Scholarship cohort.',
    category: 'Finance',
    date: '2024-06-28T08:00:00.000Z',
    link: 'https://techmindsacademy.org/scholarships',
    linkLabel: 'Review scholarship guide',
    linkType: 'external'
  },
  {
    id: 3,
    title: 'Career Studio: Building Your Portfolio',
    summary: 'Join the career team for a practical session on showcasing projects to recruiters.',
    category: 'Career',
    date: '2024-06-24T08:00:00.000Z',
    link: '/student/career-studio',
    linkLabel: 'Reserve a seat in the studio',
    linkType: 'internal'
  },
  {
    id: 4,
    title: 'Assessment Retake Window Opens 10 July',
    summary: 'Learners who missed the June assessment can retake the module exam at the hub or remotely.',
    category: 'Academics',
    date: '2024-06-22T08:00:00.000Z',
    link: '/student/assessments',
    linkLabel: 'View assessment checklist',
    linkType: 'internal'
  },
  {
    id: 5,
    title: 'Mentor Office Hours This Week',
    summary: 'Book time with a mentor to review your capstone or clarify coursework challenges.',
    category: 'Support',
    date: '2024-06-20T08:00:00.000Z',
    link: 'https://cal.com/techminds/mentor-office-hours',
    linkLabel: 'Book mentor session',
    linkType: 'external'
  }
];

router.get('/news', (req, res) => {
  res.json({
    items: newsItems,
    generatedAt: new Date().toISOString()
  });
});

export default router;
