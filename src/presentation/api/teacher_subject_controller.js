const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const subjectRepository = require('../../data_access/repositories/subject_repository');

router.get('/subjects', requireAuth('teacher'), async (req, res) => {
  const subjects = await subjectRepository.findAll();
  res.json(subjects.filter(s => s.active));
});

module.exports = router;
