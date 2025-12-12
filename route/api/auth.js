const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../../models/user');
const { requireApiLogin } = require('../../middleware/apiAuth');
const { writeAudit } = require('../../services/audit');

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'VALIDATION', message: 'username and password required' });

    const user = await User.findOne({ username, isActive: true });
    if (!user) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

    req.session.userId = user._id.toString();
    req.user = user;

    await writeAudit({ req, action: 'LOGIN', entity: 'User', entityId: user._id });

    res.json({ ok: true, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireApiLogin, async (req, res, next) => {
  try {
    const uid = req.user._id;
    req.session.destroy(async (err) => {
      if (err) return next(err);
      await writeAudit({ req: { user: null }, action: 'LOGOUT', entity: 'User', entityId: uid });
      res.json({ ok: true });
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireApiLogin, (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, role: req.user.role } });
});

module.exports = router;
