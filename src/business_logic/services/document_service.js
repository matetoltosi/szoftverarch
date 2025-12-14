const documentRepository = require('../../data_access/repositories/document_repository');

async function listAll(actor) {
  if (actor.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return documentRepository.findAll();
}

async function review(actor, documentId, status) {
  if (actor.role !== 'admin') {
    throw new Error('Forbidden');
  }

  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Invalid status');
  }

  return documentRepository.updateStatus(documentId, status);
}

module.exports = {
  listAll,
  review
};
