const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const examService = require('../../services/exam_service');

router.get('/exams', requireAuth('student'), async (req, res) => {
  const courses = await examService.listForStudent(req.session.user);
  res.json(courses);
});

router.post('/exams/:examId', requireAuth('student'), async (req, res) => {
  try {
    await examService.apply(req.session.user, req.params.examId);
    res.sendStatus(204);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/exams/:examId', requireAuth('student'), async (req, res) => {
  try {
    await examService.withdraw(req.session.user, req.params.examId);
    res.sendStatus(204);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
