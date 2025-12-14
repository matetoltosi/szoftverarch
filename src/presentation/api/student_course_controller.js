const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const courseService = require('../../services/course_service');

router.get('/courses', requireAuth('student'), async (req, res) => {
  const courses = await courseService.listForStudent(req.session.user);
  res.json(courses);
});

router.post('/courses/:courseId', requireAuth('student'), async (req, res) => {
  try {
    await courseService.apply(req.session.user, req.params.courseId);
    res.sendStatus(204);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/courses/:courseId', requireAuth('student'), async (req, res) => {
  try {
    await courseService.withdraw(req.session.user, req.params.courseId);
    res.sendStatus(204);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
