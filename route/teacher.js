// route/teacher.js
const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');
const { requireRole } = require('../middleware/auth');

// GET /teachers - list all teachers (admin only)
router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ isActive: true }).populate('user');
    res.render('teachers/list', { teachers });
  } catch (err) {
    next(err);
  }
});

// POST /teachers - create new teacher (admin only)
router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.redirect('/teachers');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
