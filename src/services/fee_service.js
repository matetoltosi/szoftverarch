const feeReposotiroy = require('../data_access/repositories/fee_repository');
const userRepository = require('../data_access/repositories/user_repository');
const auditService = require('./audit_service');
const { idFromActor } = require('./utils');

async function listAll() {
  return await feeReposotiroy.findAllPopulated();
}

async function create(actor, { studentEmail, amount }) {
  if (actor.role !== 'admin') {
    throw new Error('Forbidden');
  }

  if (amount <= 0) {
    throw new Error('Invalid amount');
  }

  const student = await userRepository.findByEmail(studentEmail);

  if (!student) {
    throw new Error('Student not found');
  }

  if (student.role !== 'student') {
    throw new Error('User is not a student');
  }

  const result = await feeReposotiroy.create({studentId: student._id, amount, status: 'unpaid'});

  await auditService.record({actor, action: 'fee_created', entityType: 'Fee', entityId: result._id, metadata: {
    studentId: student._id
  }})
  
  return result;
}

async function listForStudent(actor) {
  if (actor.role !== 'student') {
    throw new Error('Fordbidden');
  }

  const userId = await idFromActor(actor);
  return await feeReposotiroy.findByStudent(userId);
}

async function pay(actor, feeId) {
  if (actor.role !== 'student') {
    throw new Error('Fordbidden');
  }

  const fee = await feeReposotiroy.findById(feeId);
  if (!fee) {
    throw new Error('Fee not found');
  }

  const user = await userRepository.findByEmail(actor.email);
  if (!user) {
    throw new Error('User not found');
  }

  if (fee.studentId.toString() !== user._id.toString()) {
    throw new Error('Payment forbidden for another user');
  }

  if (fee.status === 'paid') {
    throw new Error('Fee already paid');
  }

  const result = await feeReposotiroy.markPaid(feeId);

  await auditService.record({actor, action: 'fee_paid', entityType: 'Fee', entityId: feeId, metadata: {
    studentId: fee.studentId
  }})

  return result;
}

module.exports = {
  listAll,
  create,
  listForStudent,
  pay
};
