const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole('admin', 'student'), async (req, res, next) => {
  try {
    const students = await Student.find({ isActive: true }).populate('user');
    res.render('students/dashboard', { students });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.redirect('/students');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
