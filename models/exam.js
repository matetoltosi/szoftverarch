// models/exam.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const examSchema = new Schema(
  {
    // reference to the course
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },

    dateTime: { type: Date, required: true },

    location: { type: String }, // optional room name or location text

    capacity: { type: Number, default: 50 },

    status: {
      type: String,
      enum: ['open', 'closed', 'deleted'],
      default: 'open'
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
