const User = require('../models/user');

async function loadUser(req, res, next) {
  try {
    const userId = req.session && req.session.userId;
    if (!userId) {
      req.user = null;
      return next();
    }

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { loadUser };
