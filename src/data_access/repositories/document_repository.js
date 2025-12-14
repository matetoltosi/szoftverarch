const Document = require('../schemas/document_schema');

function create(data) {
  return Document.create(data);
}

function findAllPopulated() {
  return Document.find()
    .sort({ uploadedAt: -1})
    .populate('studentId', 'email')
    .lean();
}

function findById(id) {
  return Document.findById(id);
}

function findByStudent(studentId) {
  return Document.find({ studentId })
    .sort({ uploadedAt: -1 })
    .lean();
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
  findAllPopulated,
  findById,
  findByStudent,
  updateStatus
};
