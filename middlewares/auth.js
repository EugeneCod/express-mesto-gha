const jwt = require('jsonwebtoken');
const { STATUS_CODES, ERROR_MESSAGES } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.AUTHORIZATION_REQUIRED });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET-KEY');
  } catch (err) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.AUTHORIZATION_REQUIRED });
  }

  req.user = payload;

  return next();
};
