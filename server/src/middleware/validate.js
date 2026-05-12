const httpStatus = require('http-status');
const { AppError } = require('./errorHandler');

const validate = (schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = parsed.body ?? req.body;
    req.query = parsed.query ?? req.query;
    req.params = parsed.params ?? req.params;
    next();
  } catch (error) {
    const messages = error.errors?.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ') || error.message;
    next(new AppError(messages, httpStatus.BAD_REQUEST));
  }
};

module.exports = validate;
