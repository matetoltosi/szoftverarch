const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true }
});

SubjectSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { active: true }}
);

module.exports = mongoose.model('Subject', SubjectSchema);
