const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const examService = require('../../services/exam_service');

router.get('/exams', requireAuth('teacher'), async (req, res) => {
  const exams = await examService.listAll();
  res.json(exams);
});

router.post('/exams', requireAuth('teacher'), async (req, res) => {
  try {
    const exam = await examService.create(
      req.session.user,
      req.body
    );
    res.status(201).json(exam);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
