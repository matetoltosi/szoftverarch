const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole('admin', 'teacher'), async (req, res, next) => {
  try {
    const subjects = await Subject.find({ isActive: true }).populate('responsibleTeacher');
    res.render('subjects/list', { subjects });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.redirect('/subjects');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
