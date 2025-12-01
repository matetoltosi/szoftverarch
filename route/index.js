const { requireLogin } = require('../middleware/auth');

module.exports = function (app) {
  app.use('/', require('./auth'));

  app.get('/', requireLogin, (req, res) => {
    res.render('index', { user: req.user });
  });

  app.use('/admin', requireLogin, require('./admin'));
  app.use('/students', requireLogin, require('./student'));
  app.use('/teachers', requireLogin, require('./teacher'));
  app.use('/subjects', requireLogin, require('./subject'));
  app.use('/courses', requireLogin, require('./course'));
};
