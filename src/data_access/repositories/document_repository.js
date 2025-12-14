const Document = require('../schemas/document_schema');

function create(data) {
  return Document.create(data);
}

function findAll() {
  return Document.find().lean();
}

function findByStudent(studentId) {
  return Document.find({ studentId }).lean();
}

function updateStatus(id, status) {
  return Document.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();
}

module.exports = {
  create,
  findAll,
  findByStudent,
  updateStatus
};
