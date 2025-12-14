const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');

router.get('/dashboard', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Student Dashboard',
    body: 'student/dashboard',
  });
});

router.get('/apply-course', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Apply for Course',
    body: 'student/apply-course',
  });
});

router.get('/apply-exam', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Apply for Exam',
    body: 'student/apply-exam',
  });
});

router.get('/upload-document', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Upload Document',
    body: 'student/uppload-document',
  });
});

router.get('/pay-fees', requireAuth('student'), (req, res) => {
  res.render('main', {
    title: 'Pay Fees',
    body: 'student/pay-fees',
  });
});

module.exports = router;
