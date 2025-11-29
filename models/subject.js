// models/subject.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    credit: { type: Number, required: true },

    description: { type: String },

    // responsible teacher
    responsibleTeacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
