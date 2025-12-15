const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const courseService = require('../../services/course_service');

router.get('/courses', requireAuth('teacher'), async (req, res) => {
  const courses = await courseService.listAll();
  res.json(courses);
});

router.post('/courses', requireAuth('teacher'), async (req, res) => {
  try {
    const course = await courseService.create(req.session.user, req.body);
    res.status(201).json(course);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/courses/:id', requireAuth('teacher'), async (req, res) => {
  try {
    const course = await courseService.update(req.session.user, req.params.id, req.body);
    res.status(201).json(course);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/courses/:id', requireAuth('teacher'), async (req, res) => {
  try {
    await courseService.remove(req.session.user, req.params.id);
    res.sendStatus(204);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
