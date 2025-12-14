const { idFromActor } = require('./utils')
const auditRepository = require('../data_access/repositories/audit_repository');

async function record({
  actor,
  action,
  entityType,
  entityId,
  metadata = {}
}) {
  if (!actor) return;
  const actorId = await idFromActor(actor);
  try {
    console.log(`[AUDIT] ${actorId} | ${action} | ${entityType} | ${entityId}`);
    return auditRepository.log({
      actorId: actorId,
      actorRole: actor.role,
      action,
      entityType,
      entityId,
      metadata
    });
  }
  catch (error) {
    console.error(`[AUDIT] ${error.message}`);
  }
}

module.exports = { record };
