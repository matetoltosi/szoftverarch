const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');

router.get('/dashboard', requireAuth('teacher'), (req, res) => {
  res.render('main', {
    title: 'Teacher Dashboard',
    body: 'teacher/dashboard',
  });
});

router.get('/courses', requireAuth('teacher'), (req, res) => {
  res.render('main', {
    title: 'Manage Courses',
    body: 'teacher/courses',
  });
});

router.get('/exams', requireAuth('teacher'), (req, res) => {
  res.render('main', {
    title: 'Manage Exams',
    body: 'teacher/exams',
  });
});

module.exports = router;