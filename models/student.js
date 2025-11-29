// models/student.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    neptunCode: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: { type: String, required: true },
    phone: { type: String },

    // e.g. BSc, MSc, PhD
    program: { type: String },

    // e.g. active, passive, graduated
    status: { type: String, default: 'active' },

    // reference to the authentication user (role: 'student')
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    isActive: { type: Boolean, default: true } // soft delete flag
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
