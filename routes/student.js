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


export default router;