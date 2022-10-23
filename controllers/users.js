const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_CODES, ERROR_MESSAGES } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ConflictError = require('../errors/not-found');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(ERROR_MESSAGES.USER_BY_ID_NOT_FOUND))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_ID));
      }
      return next(err);
    });
};

module.exports.getAuthorizedUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(ERROR_MESSAGES.USER_BY_ID_NOT_FOUND))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_ID));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 7)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => res.status(STATUS_CODES.CREATED).send(user))
    .catch((err) => {
      if (err.message.indexOf('IncorrectEmailFormat') !== -1) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_EMAIL));
      }
      if (err.message.indexOf('IncorrectUrlFormat') !== -1) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_URL));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_DATA));
      }
      if (err.code === 11000) {
        return next(new ConflictError(ERROR_MESSAGES.CONFLICT_WITH_THE_USER_BASE));
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFoundError(ERROR_MESSAGES.USER_BY_ID_NOT_FOUND))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_DATA));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_ID));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFoundError(ERROR_MESSAGES.USER_BY_ID_NOT_FOUND))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_DATA));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_ID));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'SECRET-KEY',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch((err) => {
      if (err.message.indexOf('IncorrectEmailFormat') !== -1) {
        return next(new BadRequestError(ERROR_MESSAGES.INCORRECT_EMAIL));
      }
      return next(err);
    });
};
