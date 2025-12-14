const express = require('express');
const router = express.Router();

const authService = require('../../business_logic/services/auth_service');

router.post('/login', async (req, res) => {
  try {
    const user = await authService.authenticate(
      req.body.email,
      req.body.password
    );

    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    return res.redirect(`/${user.role}/dashboard`);
  }
  catch (err) {
    req.session.loginError = err.message;
    return res.redirect('/login');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    return res.redirect('/login');
  });
});

router.get('/login', (req, res) => {
  const error = req.session.loginError;
  delete req.session.loginError;
  res.render('auth/login', {
    title: 'Login',
    error: error
  });
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).end();
  }
  
  return res.json(req.session.user);
});

module.exports = router;