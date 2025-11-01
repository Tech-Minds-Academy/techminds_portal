import express from 'express';

const router = express.Router();

const newsItems = [
  {
    id: 1,
    title: 'Cloud Computing Bootcamp Begins 15th July',
    summary: 'Kick off Module 3 with industry mentors, hands-on labs, and a live hackathon weekend.',
    category: 'Events',
    date: '2024-07-01T08:00:00.000Z',
    link: 'https://techmindsacademy.org/blog/cloud-bootcamp'
  },
  {
    id: 2,
    title: 'Scholarship Applications Close Soon',
    summary: 'Submit supporting documents by 5 July to be considered for the Impact Scholarship cohort.',
    category: 'Finance',
    date: '2024-06-28T08:00:00.000Z',
    link: 'https://techmindsacademy.org/scholarships'
  },
  {
    id: 3,
    title: 'Career Studio: Building Your Portfolio',
    summary: 'Join the career team for a practical session on showcasing projects to recruiters.',
    category: 'Career',
    date: '2024-06-24T08:00:00.000Z',
    link: 'https://techmindsacademy.org/events/career-studio'
  }
];

router.get('/news', (req, res) => {
  res.json(newsItems);
});

export default router;
