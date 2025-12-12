module.exports = function (app) {
  app.use('/api/auth', require('./auth'));
  app.use('/api/users', require('./users'));
  app.use('/api/students', require('./students'));
  app.use('/api/teachers', require('./teachers'));
  app.use('/api/subjects', require('./subjects'));
  app.use('/api/courses', require('./courses'));
  app.use('/api/exams', require('./exams'));
  app.use('/api/audit-logs', require('./audit'));
};
