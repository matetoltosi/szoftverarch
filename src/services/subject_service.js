const subjectRepository = require('../data_access/repositories/subject_repository');
const auditService = require('./audit_service');

async function createSubject(actor, { name }) {
  if (actor.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  if (!name || !name.trim()) {
    throw new Error('Subject name is required');
  }

  const result = await subjectRepository.create({name: name.trim()});

  await auditService.record({actor, action: 'subject_created', entityType: 'Subject', entityId: result._id})
}

async function getAllSubjects() {
  return subjectRepository.findAll();
}

async function updateSubject(actor, {id, name}) {
  if (actor.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const existingSubject = await subjectRepository.findById(id);
  if (!existingSubject) {
    throw new Error('Subject not found');
  }

  if (name !== undefined && !name.trim()) {
    throw new Error('Subject name cannot be empty');
  }

  const result = await subjectRepository.update(id, { name: name.trim() });

  await auditService.record({actor, action: 'subject_updated', entityType: 'Subject', entityId: id, metadata: {
    subjectName: name
  }})

  return result;
}

async function deleteSubject(actor, {id}) {
  if (actor.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const existingSubject = await subjectRepository.findById(id);
  if (!existingSubject) {
    throw new Error('Subject not found');
  }

  const result = await subjectRepository.update(id, { active: false });

  await auditService.record({actor, action: 'subject_deleted', entityType: 'Subject', entityId: id})

  return result;
}

module.exports = {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject
};
