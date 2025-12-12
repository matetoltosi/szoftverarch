const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const Student = require('../../models/student');
const User = require('../../models/user');
const { requireApiLogin, requireApiRole } = require('../../middleware/apiAuth');
const { writeAudit } = require('../../services/audit');
const { getCurrentStudent } = require('../../services/currentProfile');
const { pick } = require('../../utils/common');

router.get('/me', requireApiLogin, async (req, res, next) => {
  try {
    const s = await getCurrentStudent(req);
    if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json({ item: s });
  } catch (err) { next(err); }
});

router.get('/', requireApiRole('admin'), async (req, res, next) => {
  try {
    const includeInactive = String(req.query.includeInactive || 'false') === 'true';
    const q = includeInactive ? {} : { isActive: true };
    const items = await Student.find(q).populate('user', 'username role isActive').sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) { next(err); }
});

router.get('/:id', requireApiRole('admin'), async (req, res, next) => {
  try {
    const s = await Student.findById(req.params.id).populate('user', 'username role isActive');
    if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json({ item: s });
  } catch (err) { next(err); }
});

// Create student. If userId missing, you can pass user: { username, password } and we'll create the auth user too.
router.post('/', requireApiRole('admin'), async (req, res, next) => {
  try {
    const body = req.body || {};
    let userId = body.user;

    if (body.user && typeof body.user === 'object') {
      const { username, password } = body.user;
      if (!username || !password) return res.status(400).json({ error: 'VALIDATION', message: 'user.username and user.password required' });
      const passwordHash = await bcrypt.hash(String(password), 10);
      const u = await User.create({ username, passwordHash, role: 'student', isActive: true });
      userId = u._id;
    }

    const allowed = pick(body, ['neptunCode','firstName','lastName','email','phone','program','status']);
    if (!userId) return res.status(400).json({ error: 'VALIDATION', message: 'user required (id or object)' });

    const s = await Student.create({ ...allowed, user: userId, isActive: true });
    await writeAudit({ req, action: 'CREATE', entity: 'Student', entityId: s._id });
    res.status(201).json({ item: s });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ error: 'DUPLICATE' });
    next(err);
  }
});

router.patch('/:id', requireApiRole('admin'), async (req, res, next) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'NOT_FOUND' });

    const allowed = pick(req.body || {}, ['neptunCode','firstName','lastName','email','phone','program','status','isActive','user']);
    Object.assign(s, allowed);
    await s.save();

    await writeAudit({ req, action: 'UPDATE', entity: 'Student', entityId: s._id, meta: { fields: Object.keys(allowed) } });
    res.json({ item: s });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ error: 'DUPLICATE' });
    next(err);
  }
});

router.delete('/:id', requireApiRole('admin'), async (req, res, next) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
    s.isActive = false;
    await s.save();
    await writeAudit({ req, action: 'DELETE', entity: 'Student', entityId: s._id });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
