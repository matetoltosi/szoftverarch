// models/course.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    // reference to the subject
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },

    // assigned teacher
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },

    // classroom or location identifier
    room: { type: String, required: true },

    // scheduled datetime
    dateTime: { type: Date, required: true },

    capacity: { type: Number, default: 30 },

    // enrolled students
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
