const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/require_auth');
const subjectService = require('../../services/subject_service');

router.post('/subjects', requireAuth('admin'), async (req, res) => {
  try {
    const subject = await subjectService.createSubject(req.session.user, {
      name: req.body.name
    });

    return res.status(201).json(subject);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Subject with this name already exists' });
    }

    return res.status(500).json({ error: `Internal server error (${error})` });
  }
});

router.get('/subjects', requireAuth('admin'), async (req, res) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ error: `Internal server error (${error})` });
  }
});

router.put('/subjects/:id', requireAuth('admin'), async (req, res) => {
  try {
    const subject = await subjectService.updateSubject(req.session.user, {
      id: req.params.id, name: req.body.name
    });
    return res.json(subject);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Subject with this name already exists.' });
    }

    return res.status(500).json({ error: `Internal server error (${error})` });
  }
});

router.delete('/subjects/:id', requireAuth('admin'), async (req, res) => {
  try {
    await subjectService.deleteSubject(req.session.user, {id: req.params.id});
    return res.json({ message: 'Subject deleted' });
  } catch (error) {
    return res.status(500).json({ error: `Internal server error (${error})` });
  }
});

module.exports = router;