const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');

router.get('/dashboard', requireAuth('admin'), (req, res) => {
  res.render('main', {
    title: 'Admin Dashboard',
    body: 'admin/dashboard',
  });
});

router.get('/subjects', requireAuth('admin'), (req, res) => {
  res.render('main', {
    title: 'Manage Subjects',
    body: 'admin/subjects',
  });
});

router.get('/documents', requireAuth('admin'), (req, res) => {
  res.render('main', {
    title: 'Review Documents',
    body: 'admin/documents',
  });
});

router.get('/fees', requireAuth('admin'), (req, res) => {
  res.render('main', {
    title: 'Manage Fees',
    body: 'admin/fees',
  });
});

module.exports = router;