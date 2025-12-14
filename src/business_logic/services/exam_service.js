const examRepository = require('../../data_access/repositories/exam_repository');
const subjectRepository = require('../../data_access/repositories/subject_repository');

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

function listAll() {
  return examRepository.findAllPopulated();
}

module.exports = {
  create,
  listAll
};
