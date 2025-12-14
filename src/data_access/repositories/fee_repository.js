const Fee = require('../schemas/fee_schema');

function create(data) {
  return Fee.create(data);
}

function findAll() {
  return Fee.find().lean();
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
  findAll,
  findById,
  findByStudent,
  markPaid
};
