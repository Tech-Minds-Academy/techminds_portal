import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home');
});
router.get('/news', (req, res) => {
  res.render('pages/students/news');
});


export default router;