const res = require('express/lib/response');
const examRepository = require('../data_access/repositories/exam_repository');
const subjectRepository = require('../data_access/repositories/subject_repository');
const auditService = require('./audit_service');
const { idFromActor } = require('./utils');

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

  const result = await examRepository.create({
    name: name.trim(),
    subjectId,
    date
  });

  await auditService.record({
    actor, action: 'exam_created', entityType: 'Exam', entityId: subjectId, metadata: {
      examId: result._id
    }
  });

  return result;
}

async function listAll() {
  return await examRepository.findAllPopulated();
}

async function listForStudent(actor) {
  if (actor.role !== 'student') {
    throw new Error('Forbidden');
  }

  const exams = await examRepository.findAllPopulated();
  const userId = await idFromActor(actor);
  
  return exams.map(exam => ({
      _id: exam._id,
      name: exam.name,
      date: exam.date,
      subject: exam.subjectId.name,
      applied: exam.appliedStudents?.some(id => id.toString() === userId.toString())
  }));
}

async function apply(actor, examId) {
  if (actor.role !== 'student') {
    throw new Error('Only students can apply to exams');
  }
  const userId = await idFromActor(actor);
  const result = await examRepository.addStudent(examId, userId);

  auditService.record({actor, action: 'exam_applied', entityType: 'Exam', entityId: examId, metadata: {
    studentId: userId
  }})

  return result;
}

async function withdraw(actor, examId) {
  if (actor.role !== 'student') {
    throw new Error('Only students can withdraw from exams');
  }
  const userId = await idFromActor(actor);
  const result = await examRepository.removeStudent(examId, userId);

  auditService.record({actor, action: 'exam_withdrawn', entityType: 'Exam', entityId: examId, metadata: {
    studentId: userId
  }})

  return result;
}

module.exports = {
  create,
  listAll,
  listForStudent,
  apply,
  withdraw
};
