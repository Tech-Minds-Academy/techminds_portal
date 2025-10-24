import express from 'express';
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('pages/admin/admin');
});

router.get('/login', (req, res) => {
  res.render('pages/admin/adminlogin');
});

export default router;