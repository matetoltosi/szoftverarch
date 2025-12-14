const subjectRepository = require('../../data_access/repositories/subject_repository');

async function createSubject({ name }) {
  if (!name || !name.trim()) {
    throw new Error('Subject name is required');
  }

  return subjectRepository.create({
    name: name.trim()
  });
}

async function getAllSubjects() {
  return subjectRepository.findAll();
}

async function updateSubject(id, name) {
  const existingSubject = await subjectRepository.findById(id);
  if (!existingSubject) {
    throw new Error('Subject not found');
  }

  if (name !== undefined && !name.trim()) {
    throw new Error('Subject name cannot be empty');
  }

  return subjectRepository.update(id, { name: name.trim() });
}

async function deleteSubject(id) {
  const existingSubject = await subjectRepository.findById(id);
  if (!existingSubject) {
    throw new Error('Subject not found');
  }

  return subjectRepository.update(id, { active: false });
}

module.exports = {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject
};
