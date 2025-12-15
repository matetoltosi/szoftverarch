const Course = require('../schemas/course_schema');

function create(data) {
  return Course.create(data);
}

function update(id, data) {
  return Course.findByIdAndUpdate(id, data, { new: true });
}

function findBySubject(subjectId) {
  return Course.find({ subjectId }).lean();
}

function findById(id) {
  return Course.findById(id).lean();
}

function findAllPopulated() {
  return Course.find()
    .populate('subjectId', 'name')
    .lean();
}

function addStudent(courseId, studentId) {
  return Course.findByIdAndUpdate(
    courseId,
    { $addToSet: { appliedStudents: studentId } },
    { new: true }
  ).lean();
}

function removeStudent(courseId, studentId) {
  return Course.findByIdAndUpdate(
    courseId,
    { $pull: { appliedStudents: studentId } },
    { new: true }
  ).lean();
}

function remove(id) {
  return Course.findByIdAndUpdate(id, { active: false }).lean();
}

module.exports = {
  create,
  update,
  remove,
  findBySubject,
  findById,
  findAllPopulated,
  addStudent,
  removeStudent
};
