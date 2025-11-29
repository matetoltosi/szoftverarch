// route/student.js
const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const { requireRole } = require('../middleware/auth');

// GET /students - list all students (admin + teacher)
router.get('/', requireRole('admin', 'teacher'), async (req, res, next) => {
  try {
    const students = await Student.find({ isActive: true }).populate('user');
    res.render('students/list', { students });
  } catch (err) {
    next(err);
  }
});

// POST /students - create new student (admin only)
// Note: in a real app you would also create the related User + hash password.
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
