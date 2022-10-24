const jwt = require('jsonwebtoken');
const { ERROR_MESSAGES } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError(ERROR_MESSAGES.AUTHORIZATION_REQUIRED));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'SECRET-KEY');
  } catch (err) {
    return next(new UnauthorizedError(ERROR_MESSAGES.AUTHORIZATION_REQUIRED));
  }

  req.user = payload;

  return next();
};
