const express = require('express');
const router = express.Router();

const Subject = require('../../models/subject');
const { requireApiRole } = require('../../middleware/apiAuth');
const { writeAudit } = require('../../services/audit');
const { pick } = require('../../utils/common');

router.get('/', requireApiRole('admin','teacher','student'), async (req, res, next) => {
  try {
    const includeInactive = String(req.query.includeInactive || 'false') === 'true';
    const q = includeInactive ? {} : { isActive: true };
    const items = await Subject.find(q).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) { next(err); }
});

router.get('/:id', requireApiRole('admin','teacher','student'), async (req, res, next) => {
  try {
    const s = await Subject.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json({ item: s });
  } catch (err) { next(err); }
});

router.post('/', requireApiRole('admin'), async (req, res, next) => {
  try {
    const allowed = pick(req.body || {}, ['name','code','credit']);
    const s = await Subject.create({ ...allowed, isActive: true });
    await writeAudit({ req, action: 'CREATE', entity: 'Subject', entityId: s._id });
    res.status(201).json({ item: s });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ error: 'DUPLICATE' });
    next(err);
  }
});

router.patch('/:id', requireApiRole('admin'), async (req, res, next) => {
  try {
    const s = await Subject.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'NOT_FOUND' });

    const allowed = pick(req.body || {}, ['name','code','credit','isActive']);
    Object.assign(s, allowed);
    await s.save();

    await writeAudit({ req, action: 'UPDATE', entity: 'Subject', entityId: s._id, meta: { fields: Object.keys(allowed) } });
    res.json({ item: s });
  } catch (err) { next(err); }
});

router.delete('/:id', requireApiRole('admin'), async (req, res, next) => {
  try {
    const s = await Subject.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
    s.isActive = false;
    await s.save();
    await writeAudit({ req, action: 'DELETE', entity: 'Subject', entityId: s._id });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
