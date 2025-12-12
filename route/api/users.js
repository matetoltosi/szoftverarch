const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../../models/user');
const { requireApiRole } = require('../../middleware/apiAuth');
const { writeAudit } = require('../../services/audit');
const { pick } = require('../../utils/common');

function publicUser(u) {
  return { id: u._id, username: u.username, role: u.role, isActive: u.isActive, createdAt: u.createdAt, updatedAt: u.updatedAt };
}

router.get('/', requireApiRole('admin'), async (req, res, next) => {
  try {
    const includeInactive = String(req.query.includeInactive || 'false') === 'true';
    const q = includeInactive ? {} : { isActive: true };
    const items = await User.find(q).sort({ createdAt: -1 });
    res.json({ items: items.map(publicUser) });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireApiRole('admin'), async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json({ item: publicUser(u) });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireApiRole('admin'), async (req, res, next) => {
  try {
    const { username, password, role } = req.body || {};
    if (!username || !password || !role) return res.status(400).json({ error: 'VALIDATION' });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const u = await User.create({ username, passwordHash, role, isActive: true });
    await writeAudit({ req, action: 'CREATE', entity: 'User', entityId: u._id, meta: { username, role } });
    res.status(201).json({ item: publicUser(u) });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ error: 'DUPLICATE', message: 'username already exists' });
    next(err);
  }
});

router.patch('/:id', requireApiRole('admin'), async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'NOT_FOUND' });

    const allowed = pick(req.body || {}, ['username', 'role', 'isActive']);
    if (req.body && req.body.password) {
      allowed.passwordHash = await bcrypt.hash(String(req.body.password), 10);
    }

    Object.assign(u, allowed);
    await u.save();

    await writeAudit({ req, action: 'UPDATE', entity: 'User', entityId: u._id, meta: { fields: Object.keys(allowed) } });
    res.json({ item: publicUser(u) });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ error: 'DUPLICATE', message: 'username already exists' });
    next(err);
  }
});

router.delete('/:id', requireApiRole('admin'), async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'NOT_FOUND' });
    u.isActive = false;
    await u.save();
    await writeAudit({ req, action: 'DELETE', entity: 'User', entityId: u._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
