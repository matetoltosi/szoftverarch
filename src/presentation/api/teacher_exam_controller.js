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

router.put('/exams/:id', requireAuth('teacher'), async (req, res) => {
  try {
    const course = await examService.update(req.session.user, req.params.id, req.body);
    res.status(201).json(course);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/exams/:id', requireAuth('teacher'), async (req, res) => {
  try {
    await examService.remove(req.session.user, req.params.id);
    res.sendStatus(204);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/exams/:id/results', requireAuth('teacher'), async (req, res) => {
    try {
      const data = await examService.listResultsForTeacher(req.session.user, req.params.id);
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
);

router.put('/exams/:id/results/:studentId', requireAuth('teacher'), async (req, res) => {
  try {
    const course = await examService.grade(req.session.user, req.params.id, req.params.studentId, req.body.grade);
    res.sendStatus(204);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
