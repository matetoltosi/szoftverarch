// route/index.js
const { requireLogin } = require('../middleware/auth');

module.exports = function (app) {
  // auth routes (login/logout)
  app.use('/', require('./auth'));

  // home - protected (requires login)
  app.get('/', requireLogin, (req, res) => {
    res.render('index', { user: req.user });
  });

  // domain routes - all require login
  app.use('/admin', requireLogin, require('./admin'));
  app.use('/students', requireLogin, require('./student'));
  app.use('/teachers', requireLogin, require('./teacher'));
  app.use('/subjects', requireLogin, require('./subject'));
  app.use('/courses', requireLogin, require('./course'));

  // exam / fee routes will be added later
};
