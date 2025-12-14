const Fee = require('../schemas/fee_schema');

function create(data) {
  return Fee.create(data);
}

function findAllPopulated() {
  return Fee.find()
    .populate('studentId', 'email')
    .lean();
}

function findById(feeId) {
  return Fee.findById(feeId).lean();
}

function findByStudent(studentId) {
  return Fee.find({ studentId }).lean();
}

function markPaid(id) {
  return Fee.findByIdAndUpdate(
    id,
    { status: 'paid' },
    { new: true }
  ).lean();
}

module.exports = {
  create,
  findAllPopulated,
  findById,
  findByStudent,
  markPaid
};
