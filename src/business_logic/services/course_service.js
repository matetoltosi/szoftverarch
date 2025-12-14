const courseRepository = require('../../data_access/repositories/course_repository');
const subjectRepository = require('../../data_access/repositories/subject_repository');
const userRepository = require('../../data_access/repositories/user_repository');

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

  return courseRepository.create({
    name: name.trim(),
    subjectId
  });
}

async function listAll() {
  return await courseRepository.findAllPopulated();
}

async function listForStudent(actor) {
  if (actor.role !== 'student') {
    throw new Error('Forbidden');
  }

  const courses = await courseRepository.findAllPopulated();
  const user = await userRepository.findByEmail(actor.email);
  
  return courses.map(course => ({
    _id: course._id,
    name: course.name,
    subject: course.subjectId.name,
    applied: course.appliedStudents?.some(id => id.toString() === user._id.toString())
  }));
}

async function apply(actor, courseId) {
  if (actor.role !== 'student') {
    throw new Error('Only students can apply to courses');
  }
  const user = await userRepository.findByEmail(actor.email);
  return await courseRepository.addStudent(courseId, user._id);
}

async function withdraw(actor, courseId) {
  if (actor.role !== 'student') {
    throw new Error('Only students can withdraw from courses');
  }
  const user = await userRepository.findByEmail(actor.email);
  return await courseRepository.removeStudent(courseId, user._id);
}

module.exports = {
  create,
  listAll,
  listForStudent,
  apply,
  withdraw
};
