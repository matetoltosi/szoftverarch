const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');

router.get('/dashboard', requireAuth('admin'), (req, res) => {
  res.render('main', {
    title: 'Admin Dashboard',
    body: 'admin/dashboard',
  });
});

router.get('/manage-subjects', requireAuth('admin'), (req, res) => {
  res.render('main', {
    title: 'Manage Subjects',
    body: 'admin/manage-subjects',
  });
});

router.get('/review-documents', requireAuth('admin'), (req, res) => {
  res.render('main', {
    title: 'Review Documents',
    body: 'admin/review-documents',
  });
});

router.get('/manage-fees', requireAuth('admin'), (req, res) => {
  res.render('main', {
    title: 'Manage Fees',
    body: 'admin/manage-fees',
  });
});

module.exports = router;