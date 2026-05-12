const httpStatus = require('http-status');
const { AppError } = require('./errorHandler');

const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', httpStatus.UNAUTHORIZED));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', httpStatus.FORBIDDEN));
    }
    next();
  };
};

module.exports = authorize;
