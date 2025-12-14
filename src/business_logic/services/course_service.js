const courseRepository = require('../../data_access/repositories/course_repository');
const subjectRepository = require('../../data_access/repositories/subject_repository');

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

function listAll() {
  return courseRepository.findAllPopulated();
}

module.exports = {
  create,
  listAll
};
