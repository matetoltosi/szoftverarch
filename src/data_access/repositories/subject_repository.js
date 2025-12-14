const Subject = require('../schemas/subject_schema');

function create(data) {
  return Subject.create(data);
}

function findAll() {
  return Subject.find().lean();
}

function findById(id) {
  return Subject.findById(id).lean();
}

function findActiveByName(name) {
  return Subject.findOne({ name: name, active: true }).lean();
}

function update(id, data) {
  return Subject.findByIdAndUpdate(id, data, { new: true }).lean();
}

module.exports = {
  create,
  findAll,
  findById,
  findActiveByName,
  update
};
