const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin']
  }
});

module.exports = mongoose.model('User', UserSchema);
