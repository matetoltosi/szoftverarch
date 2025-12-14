const AuditLog = require('../schemas/audit_schema');

function log(entry) {
  return AuditLog.create(entry);
}

module.exports = { log };
