const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect(`/${req.session.user.role}/dashboard`);
  }

  const error = req.session.loginError;
  delete req.session.loginError;

  res.render('main', {
    title: 'Login',
    body: 'login',
    error
  });
});

router.get('/', (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');
  return res.redirect(`/${user.role}/dashboard`);
});

module.exports = router;