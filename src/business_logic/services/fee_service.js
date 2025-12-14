const feeReposotiroy = require('../../data_access/repositories/fee_repository');
const userRepository = require('../../data_access/repositories/user_repository');

async function listAll() {
  const fees = await feeReposotiroy.findAll();

  return Promise.all(fees.map(async (fee) => {
    const student = await userRepository.findById(fee.studentId);
    return {
      _id: fee._id,
      studentEmail: student.email,
      amount: fee.amount,
      status: fee.status
    };
  }));
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

  return feeReposotiroy.create({
    studentId: student._id,
    amount,
    status: 'unpaid'
  });
}

async function listForStudent(actor) {
  if (actor.role !== 'student') {
    throw new Error('Fordbidden');
  }

  const user = await userRepository.findByEmail(actor.email);
  return await feeReposotiroy.findByStudent(user._id);
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

  await feeReposotiroy.markPaid(feeId);
}

module.exports = {
  listAll,
  create,
  listForStudent,
  pay
};
