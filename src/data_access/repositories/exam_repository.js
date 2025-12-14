const Exam = require('../schemas/exam_schema');

function create(data) {
  return Exam.create(data);
}

function findAllPopulated() {
  return Exam.find()
    .populate('subjectId', 'name')
    .lean();
}

function findBySubject(subjectId) {
  return Exam.find({ subjectId }).lean();
}

function findByCourse(courseId) {
  return Exam.find({ courseId }).lean();
}

function remove(id) {
  return Exam.findByIdAndDelete(id);
}

module.exports = {
  create,
  findAllPopulated,
  findBySubject,
  findByCourse,
  remove
};
