const Student = require('../models/student');
const Teacher = require('../models/teacher');

async function getCurrentStudent(req) {
  if (!req.user) return null;
  if (req.user.role !== 'student') return null;
  return Student.findOne({ user: req.user._id, isActive: true });
}

async function getCurrentTeacher(req) {
  if (!req.user) return null;
  if (req.user.role !== 'teacher') return null;
  return Teacher.findOne({ user: req.user._id, isActive: true });
}

module.exports = { getCurrentStudent, getCurrentTeacher };
