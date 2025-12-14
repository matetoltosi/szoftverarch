const express = require('express');
const router = express.Router();

const documentService = require('../../business_logic/services/document.service');
const requireAuth = require('../middleware/requireAuth');

router.get('/documents', requireAuth('admin'), async (req, res) => {
  const docs = await documentService.listAll();
  res.json(docs);
});

router.put('/documents/:id/approve', requireAuth('admin'), async (req, res) => {
  await documentService.review(req.session.user, req.params.id, 'approved');
  res.sendStatus(204);
});

router.put('/documents/:id/reject', requireAuth('admin'), async (req, res) => {
  await documentService.review(req.session.user, req.params.id, 'rejected');
  res.sendStatus(204);
});

module.exports = router;
