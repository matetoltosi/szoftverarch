const path = require('path');
const documentRepository = require('../data_access/repositories/document_repository');
const auditService = require('./audit_service');
const { idFromActor } = require('./utils');

async function listAll(actor) {
  if (actor.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return documentRepository.findAllPopulated();
}

async function listForStudent(actor) {
  if (actor.role !== 'student') {
    throw new Error('Forbidden');
  }

  const userId = await idFromActor(actor);
  const docs = await documentRepository.findByStudent(userId);

  return docs.map(d => ({
    _id: d._id,
    type: d.type,
    text: d.text,
    filePath: d.filePath,
    status: d.status,
    uploadedAt: d.uploadedAt
  }));
}

async function submit(actor, { type, name, text, filePath }) {
  if (actor.role !== 'student') {
    throw new Error('User must be a student to upload documents');
  }

  if (!type) {
    throw new Error('Document type required');
  }

  const userId = await idFromActor(actor);
  const result = await documentRepository.create({
    studentId: userId,
    type: type,
    name: name,
    text: text || '',
    filePath: filePath || null,
    status: 'submitted'
  });

  await auditService.record({actor, action: 'document_upload', entityType: 'Document', entityId: result._id});

  return result;
}

async function review(actor, documentId, status) {
  if (actor.role !== 'admin') {
    throw new Error('User must be an admin to review documents');
  }

  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Invalid status');
  }

  const document = await documentRepository.findById(documentId);
  if (!document) {
    throw new Error('Document not found');
  }

  const result = await documentRepository.updateStatus(documentId, status);

  await auditService.record({actor, action: 'document_review', entityType: 'Document', entityId: documentId, metadata: { status: status }});

  return result;
}

async function downloadFile(actor, documentId) {
  if (!actor) {
    throw new Error('Unauthenticated');
  }

  const document = await documentRepository.findById(documentId);
  if (!document || !document.filePath) {
    throw new Error('Document not found');
  }

  const userId = await idFromActor(actor);
  if (actor.role !== 'admin' && document.studentId.toString() !== userId.toString()) {
    throw new Error('Forbidden');
  }

  return {
    absolutePath: path.resolve(document.filePath),
    originalName: path.basename(document.filePath)
  };
}

module.exports = {
  listAll,
  listForStudent,
  submit,
  review,
  downloadFile
};
