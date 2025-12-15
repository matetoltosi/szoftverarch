const res = require('express/lib/response');
const examRepository = require('../data_access/repositories/exam_repository');
const subjectRepository = require('../data_access/repositories/subject_repository');
const auditService = require('./audit_service');
const { idFromActor } = require('./utils');
const { setDriver } = require('mongoose');

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

async function update(actor, examId, data) {
  if (actor.role !== 'teacher') {
    throw new Error('Fordbidden');
  }

  const result = await examRepository.update(examId, { name: data.name?.trim() });

  auditService.record({
    actor, action: 'exam_updated', entityType: 'Course', entityId: examId
  });

  return result;
}

async function remove(actor, courseId) {
  if (actor.role !== 'teacher') {
    throw new Error('Fordbidden');
  }

  const result = await courseRepository.remove(courseId);

  auditService.record({
    actor, action: 'course_removed', entityType: 'Course', entityId: courseId
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

  return exams.map(exam => {
    const entry = exam.results.find(result => result.studentId._id.toString() === userId.toString());
    return {
        _id: exam._id,
        name: exam.name,
        date: exam.date,
        subject: exam.subjectId.name,
        applied: !!entry,
        grade: entry?.grade ?? null
    };
  })
}

async function listResultsForTeacher(actor, examId) {
  if (actor.role !== 'teacher') {
    throw new Error('Forbidden');
  }

  const exam = await examRepository.findByIdWithResults(examId);
  if (!exam) {
    throw new Error('Exam not found');
  }

  return {
    examId: exam._id,
    examName: exam.name,
    subject: exam.subjectId.name,
    date: exam.date,
    students: exam.results.map(r => ({
      studentId: r.studentId._id,
      email: r.studentId.email,
      grade: r.grade
    }))
  };
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

async function grade(actor, examId, studentId, grade) {
  if (actor.role !== 'teacher') {
    throw new Error('Fordbidden');
  }

  if (grade < 1 || grade > 5) {
     throw new Error('Invalid grade');
  }

  const result = await examRepository.setGrade(examId, studentId, grade);

  auditService.record({
    actor, action: 'exam_graded', entityType: 'Exam', entityId: examId, metadata: {
      studentId: studentId, grade: grade
    }
  });

  return result;
}

module.exports = {
  create,
  update,
  remove,
  listAll,
  listForStudent,
  listResultsForTeacher,
  apply,
  withdraw,
  grade
};
