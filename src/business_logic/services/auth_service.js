const userRepository = require('../../data_access/repositories/user_repository');

async function authenticate(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('User not found');

  if (user.password !== password) {
    throw new Error('Invalid password');
  }

  return user;
}

module.exports = {authenticate};