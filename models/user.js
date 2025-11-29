// models/user.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true
    },
    isActive: { type: Boolean, default: true } // soft delete flag
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
