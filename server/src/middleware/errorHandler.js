const httpStatus = require('http-status');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = httpStatus.BAD_REQUEST;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(', ');
  }

  if (err.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value for ${field}`;
  }

  if (err.name === 'CastError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Token expired';
  }

  if (req.timedout) {
    statusCode = httpStatus.REQUEST_TIMEOUT;
    message = 'Request timeout';
  }

  const response = {
    success: false,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

const env = require('../config/env');

module.exports = { AppError, errorHandler };
