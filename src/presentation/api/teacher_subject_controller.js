const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const subjectService = require('../../services/subject_service');

router.get('/subjects', requireAuth('teacher'), async (req, res) => {
  const subjects = await subjectService.getAllSubjects();
  res.json(subjects.filter(s => s.active));
});

module.exports = router;
