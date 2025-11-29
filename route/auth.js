// route/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/user');

// GET /login - render login form
router.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/'); // already logged in
  }
  res.render('auth/login', { error: null });
});

// POST /login - handle login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return res.status(401).render('auth/login', { error: 'Invalid credentials' });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return res.status(401).render('auth/login', { error: 'Invalid credentials' });
    }

    // store user id in session
    req.session.userId = user._id.toString();

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// POST /logout - destroy session
router.post('/logout', (req, res, next) => {
  if (!req.session) {
    return res.redirect('/login');
  }
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
