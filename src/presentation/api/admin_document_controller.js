const express = require('express');
const router = express.Router();

const documentService = require('../../services/document_service');
const requireAuth = require('../middlewares/require_auth');

router.get('/documents', requireAuth('admin'), async (req, res) => {
  const docs = await documentService.listAll(req.session.user);
  res.json(docs);
});

router.get('/documents/:id', requireAuth('admin'), async (req, res) => {
    try {
      const file = await documentService.downloadFile(req.session.user, req.params.id);
      res.download(file.absolutePath, file.originalName);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put('/documents/:id/approve', requireAuth('admin'), async (req, res) => {
  await documentService.review(req.session.user, req.params.id, 'approved');
  res.sendStatus(204);
});

router.put('/documents/:id/reject', requireAuth('admin'), async (req, res) => {
  await documentService.review(req.session.user, req.params.id, 'rejected');
  res.sendStatus(204);
});

module.exports = router;
