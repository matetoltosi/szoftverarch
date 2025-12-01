const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/user');

router.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/'); 
  }
  res.render('auth/login', { error: null });
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return res.status(401).render('auth/login', { error: 'Invalid credentials (username not found)' });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return res.status(401).render('auth/login', { error: 'Invalid credentials (password is incorrect)' });
    }

    
    req.session.userId = user._id.toString();

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

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
