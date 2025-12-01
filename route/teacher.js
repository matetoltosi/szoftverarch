const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ isActive: true }).populate('user');
    res.render('teacher/dashboard', { teachers });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.redirect('/teacher');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
