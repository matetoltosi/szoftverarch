const User = require('../models/user');

async function loadUser(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      req.user = null;
      return next();
    }

    const user = await User.findById(req.session.userId);

    if (!user || !user.isActive) {
      req.user = null;
    } else {
      req.user = user;
      res.locals.currentUser = user;
    }

    next();
  } catch (err) {
    next(err);
  }
}

function requireLogin(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
}

module.exports = {
  loadUser,
  requireLogin,
  requireRole
};
