const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: Date,
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  results: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      grade: {
        type: Number,
        min: 1,
        max: 5,
        default: null
      }
    }
],
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Exam', ExamSchema);
