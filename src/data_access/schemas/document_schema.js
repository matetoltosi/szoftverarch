const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['certificate', 'request', 'other']
  },
  name: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', DocumentSchema);
