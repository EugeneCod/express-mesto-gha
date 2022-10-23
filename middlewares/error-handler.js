const { STATUS_CODES, ERROR_MESSAGES } = require('../utils/constants');

module.exports = ((err, req, res, next) => {
  const {
    statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
    message,
  } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? ERROR_MESSAGES.DEFAULT_SERVER_ERROR
        : message,
    });

  next();
});
