const express = require('express');
const router = express.Router();
const { requireLogin, requireRole } = require('../middleware/auth');
const User = require('../models/user');

// GET /admin
router.get('/', requireLogin, requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').lean();
    res.render('admin/index', { users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;