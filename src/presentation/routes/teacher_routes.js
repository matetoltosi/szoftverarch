const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');

router.get('/dashboard', requireAuth('teacher'), (req, res) => {
  res.render('main', {
    title: 'Teacher Dashboard',
    body: 'teacher/dashboard',
  });
});

router.get('/manage-courses', requireAuth('teacher'), (req, res) => {
  res.render('main', {
    title: 'Manage Courses',
    body: 'teacher/manage-courses',
  });
});

router.get('/manage-exams', requireAuth('teacher'), (req, res) => {
  res.render('main', {
    title: 'Manage Exams',
    body: 'teacher/manage-exams',
  });
});

module.exports = router;