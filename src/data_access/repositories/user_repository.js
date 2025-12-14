const User = require('../schemas/user_schema');

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
  findByEmail,
  create,
  findAll
};
