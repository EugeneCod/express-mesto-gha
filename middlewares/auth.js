const jwt = require('jsonwebtoken');
const { STATUS_CODES, ERROR_MESSAGES } = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.AUTHORIZATION_REQUIRED });
  }

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
