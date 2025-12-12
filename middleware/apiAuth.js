const User = require('../models/user');

/**
 * Session-based API auth.
 * Assumes express-session is configured and loadUser middleware is applied globally.
 */

function requireApiLogin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'UNAUTHENTICATED' });
  }
  next();
}

function requireApiRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
  };
}

module.exports = { requireApiLogin, requireApiRole };
