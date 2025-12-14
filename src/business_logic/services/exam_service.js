const examRepository = require('../../data_access/repositories/exam_repository');
const subjectRepository = require('../../data_access/repositories/subject_repository');
const userRepository = require('../../data_access/repositories/user_repository');

async function create(actor, { name, subjectId, date }) {
  if (actor.role !== 'teacher') {
    throw new Error('Only teachers can create exams');
  }

  if (!name || !subjectId) {
    throw new Error('Missing data');
  }

  const subject = await subjectRepository.findById(subjectId);
  if (!subject || !subject.active) {
    throw new Error('Invalid subject');
  }

  return examRepository.create({
    name: name.trim(),
    subjectId,
    date
  });
}

async function listAll() {
  return await examRepository.findAllPopulated();
}

async function listForStudent(actor) {
  if (actor.role !== 'student') {
    throw new Error('Forbidden');
  }

  const exams = await examRepository.findAllPopulated();
  const user = await userRepository.findByEmail(actor.email);
  
  return exams.map(exam => ({
      _id: exam._id,
      name: exam.name,
      date: exam.date,
      subject: exam.subjectId.name,
      applied: exam.appliedStudents?.some(id => id.toString() === user._id.toString())
  }));
}

async function apply(actor, courseId) {
  if (actor.role !== 'student') {
    throw new Error('Only students can apply to exams');
  }
  const user = await userRepository.findByEmail(actor.email);
  return await examRepository.addStudent(courseId, user._id);
}

async function withdraw(actor, courseId) {
  if (actor.role !== 'student') {
    throw new Error('Only students can withdraw from exams');
  }
  const user = await userRepository.findByEmail(actor.email);
  return await examRepository.removeStudent(courseId, user._id);
}

module.exports = {
  create,
  listAll,
  listForStudent,
  apply,
  withdraw
};
