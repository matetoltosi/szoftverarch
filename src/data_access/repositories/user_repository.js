const User = require('../schemas/user_schema');

async function findById(id) {
  return User.findById(id).lean();
}

async function findByEmail(email) {
  return User.findOne({ email }).lean();
}

async function create(user) {
  return User.create(user);
}

async function findAll() {
  return User.find().lean();
}

module.exports = {
  findById,
  findByEmail,
  create,
  findAll
};
