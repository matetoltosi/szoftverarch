const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');

router.get('/dashboard', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Student Dashboard',
    body: 'student/dashboard',
  });
});

router.get('/courses', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Apply for Course',
    body: 'student/courses',
  });
});

router.get('/exams', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Apply for Exam',
    body: 'student/exams',
  });
});

router.get('/documents', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Upload Document',
    body: 'student/documents',
  });
});

router.get('/fees', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Pay Fees',
    body: 'student/fees',
  });
});

module.exports = router;
