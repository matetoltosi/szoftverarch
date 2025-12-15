const express = require('express');
const multer = require('multer');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const documentService = require('../../services/document_service');

const upload = multer({dest: '/app/uploads/'});

router.get('/documents', requireAuth('student'), async (req, res) => {
    try {
      const docs = await documentService.listForStudent(req.session.user);
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post('/documents', requireAuth('student'), upload.single('file'), async (req, res) => {
  try {
    await documentService.submit(req.session.user, {
      type: req.body.type,
      text: req.body.text,
      name: req.file? req.file.originalname : '',
      filePath: req.file? req.file.path : null
    });

    res.sendStatus(201);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/documents/:id', requireAuth('student'), async (req, res) => {
    try {
      const file = await documentService.downloadFile(req.session.user, req.params.id);
      res.download(file.absolutePath, file.originalName);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
