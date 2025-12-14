const Course = require('../schemas/course_schema');

function create(data) {
  return Course.create(data);
}

function findBySubject(subjectId) {
  return Course.find({ subjectId }).lean();
}

function findById(id) {
  return Course.findById(id).lean();
}

function remove(id) {
  return Course.findByIdAndDelete(id);
}

module.exports = {
  create,
  findBySubject,
  findById,
  remove
};
