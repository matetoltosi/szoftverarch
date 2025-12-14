const userRepository = require('../data_access/repositories/user_repository');

async function idFromActor(actor) {
  return (await userRepository.findByEmail(actor.email))._id;
}

module.exports = { idFromActor };