import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/students/dashboard');
});

router.get('/login', (req, res) => {
  res.render('pages/students/login');
});

router.get('/register', (req, res) => {
  res.render('pages/students/register');
});

router.get('/forgot', (req, res) => {
  res.render('pages/students/forgot');
});

router.get('/courses', (req, res) => {
  res.render('pages/students/courses');
});

router.get('/profile', (req, res) => {
  res.render('pages/students/profile');
});

router.get('/timetable', (req, res) => {
  res.render('pages/students/timetable');
});

router.get('/career-studio', (req, res) => {
  res.render('pages/students/career-studio');
});

router.get('/assessments', (req, res) => {
  res.render('pages/students/assessments');
});

export default router;
