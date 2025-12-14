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

module.exports = router;
