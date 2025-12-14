const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  actorRole: {
    type: String,
    required: true
  },

  action: {
    type: String,
    required: true
  },

  entityType: {
    type: String,
    required: true
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },

  metadata: {
    type: Object
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', AuditSchema);
