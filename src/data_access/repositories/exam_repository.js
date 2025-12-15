const Exam = require('../schemas/exam_schema');

function create(data) {
  return Exam.create(data);
}

function update(id, data) {
  return Exam.findByIdAndUpdate(id, data, { new: true });
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

function findByIdWithResults(examId) {
  return Exam.findById(examId)
    .populate('subjectId', 'name')
    .populate('results.studentId', 'email')
    .lean();
}

function addStudent(examId, studentId) {
  return Exam.findByIdAndUpdate(
    examId,
    { $addToSet: { results: { studentId, grade: null } } },
    { new: true }
  ).lean();
}

function removeStudent(examId, studentId) {
  return Exam.findByIdAndUpdate(
    examId,
    { $pull: { results: { studentId } } },
    { new: true }
  ).lean();
}

function setGrade(examId, studentId, grade) {
  return Exam.updateOne({ _id: examId, 'results.studentId': studentId },
  { $set: {'results.$.grade': grade} });
}

function remove(id) {
  return Exam.findByIdAndUpdate(id, { active: false }).lean();
}

module.exports = {
  create,
  update,
  remove,
  findAllPopulated,
  findBySubject,
  findByCourse,
  findByIdWithResults,
  addStudent,
  removeStudent,
  setGrade
};
