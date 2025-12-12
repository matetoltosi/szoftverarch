const express = require('express');
const router = express.Router();

const AuditLog = require('../../models/auditLog');
const { requireApiRole } = require('../../middleware/apiAuth');
const { toInt } = require('../../utils/common');

router.get('/', requireApiRole('admin'), async (req, res, next) => {
  try {
    const limit = Math.min(500, Math.max(1, toInt(req.query.limit, 100)));
    const items = await AuditLog.find({}).sort({ createdAt: -1 }).limit(limit);
    res.json({ items });
  } catch (err) { next(err); }
});

module.exports = router;
