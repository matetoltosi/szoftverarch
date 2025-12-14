const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/requireAuth');
const courseRepo = require('../../data_access/repositories/course_repository');

router.get('/courses', requireAuth('student'), async (req, res) => {
  const courses = await courseRepo.findAllPopulated();
  res.json(courses);
});

// router.post('/courses/apply', requireAuth('student'), async (req, res) => {
//   await enrollmentRepo.create({
//     studentId: req.session.user._id,
//     courseId: req.body.courseId
//   });

//   res.sendStatus(201);
// });

module.exports = router;
