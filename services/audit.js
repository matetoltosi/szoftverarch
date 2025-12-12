const AuditLog = require('../models/auditLog');

async function writeAudit({ req, action, entity, entityId, meta }) {
  try {
    await AuditLog.create({
      actorUser: req.user ? req.user._id : undefined,
      actorRole: req.user ? req.user.role : undefined,
      action,
      entity,
      entityId,
      meta
    });
  } catch (e) {
    // Never break request because of audit failure
    console.error('AuditLog write failed:', e.message);
  }
}

module.exports = { writeAudit };
