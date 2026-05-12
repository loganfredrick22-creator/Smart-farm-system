const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const env = require('../config/env');
const { AppError } = require('./errorHandler');

const authenticate = (req, _res, next) => {
  const token = req.cookies?.accessToken || req.headers?.authorization?.replace('Bearer ', '');
  if (!token) {
    return next(new AppError('Authentication required', httpStatus.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', httpStatus.UNAUTHORIZED));
  }
};

module.exports = authenticate;
