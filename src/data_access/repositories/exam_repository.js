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

function addStudent(examId, studentId) {
  return Exam.findByIdAndUpdate(
    examId,
    { $addToSet: { appliedStudents: studentId } },
    { new: true }
  ).lean();
}

function removeStudent(examId, studentId) {
  return Exam.findByIdAndUpdate(
    examId,
    { $pull: { appliedStudents: studentId } },
    { new: true }
  ).lean();
}

function remove(id) {
  return Exam.findByIdAndDelete(id).lean();
}

module.exports = {
  create,
  findAllPopulated,
  findBySubject,
  findByCourse,
  addStudent,
  removeStudent,
  remove
};
