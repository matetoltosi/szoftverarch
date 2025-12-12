const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    actorUser: { type: Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String },
    action: { type: String, required: true },
    entity: { type: String },
    entityId: { type: Schema.Types.ObjectId },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
