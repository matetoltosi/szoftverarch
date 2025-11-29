// models/teacher.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    department: { type: String },

    // reference to the auth user (role: 'teacher')
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    isActive: { type: Boolean, default: true } // soft delete flag
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
