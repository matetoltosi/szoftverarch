const courseRepository = require('../data_access/repositories/course_repository');
const subjectRepository = require('../data_access/repositories/subject_repository');
const auditService = require('./audit_service');
const { idFromActor } = require('./utils');

async function create(actor, { name, subjectId }) {
  if (actor.role !== 'teacher') {
    throw new Error('Only teachers can create courses');
  }

  if (!name || !subjectId) {
    throw new Error('Missing data');
  }

  const subject = await subjectRepository.findById(subjectId);
  if (!subject || !subject.active) {
    throw new Error('Invalid subject');
  }

  const course = await courseRepository.create({
    name: name.trim(),
    subjectId
  });

  auditService.record({
    actor, action: 'course_created', entityType: 'Course', entityId: course._id
  });

  return course;
}

async function listAll() {
  return await courseRepository.findAllPopulated();
}

async function listForStudent(actor) {
  if (actor.role !== 'student') {
    throw new Error('Forbidden');
  }

  const courses = await courseRepository.findAllPopulated();
  const userId = await idFromActor(actor);

  return courses.map(course => ({
    _id: course._id,
    name: course.name,
    subject: course.subjectId.name,
    applied: course.appliedStudents?.some(id => id.toString() === userId.toString())
  }));
}

async function apply(actor, courseId) {
  if (actor.role !== 'student') {
    throw new Error('Only students can apply to courses');
  }
  const userId = await idFromActor(actor);
  const result = await courseRepository.addStudent(courseId, userId);

  auditService.record({
    actor, action: 'course_applied', entityType: 'Course', entityId: courseId, metadata: {
      studentId: userId
    }
  });

  return result;
}

async function withdraw(actor, courseId) {
  if (actor.role !== 'student') {
    throw new Error('Only students can withdraw from courses');
  }
  const userId = await idFromActor(actor);
  const result = await courseRepository.removeStudent(courseId, userId);

  auditService.record({
    actor, action: 'course_withdrawn', entityType: 'Course', entityId: courseId, metadata: {
      studentId: userId
    }
  });

  return result;
}

module.exports = {
  create,
  listAll,
  listForStudent,
  apply,
  withdraw
};
