const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const { STATUS_CODES, ERROR_MESSAGES } = require('../utils/constants');

function sendDefaultServerError(err, res) {
  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(
    { message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR },
  );
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      sendDefaultServerError(err, res);
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFoundError'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_ID });
      }
      if (err.message === 'NotFoundError') {
        return res.status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.USER_BY_ID_NOT_FOUND });
      }
      return sendDefaultServerError(err, res);
    });
};

module.exports.createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(STATUS_CODES.CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_DATA });
      }
      return sendDefaultServerError(err, res);
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findById(req.user._id).orFail(new Error('NotFoundError'))
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        {
          new: true,
          runValidators: true,
        },
      )
        .then((updatedUser) => res.send(updatedUser))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            return res.status(STATUS_CODES.BAD_REQUEST)
              .send({ message: ERROR_MESSAGES.INCORRECT_DATA });
          }
          return null;
        });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.USER_BY_ID_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_ID });
      }
      return sendDefaultServerError(err, res);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findById(req.user._id).orFail(new Error('NotFoundError'))
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { avatar: req.body.avatar },
        {
          new: true,
          runValidators: true,
        },
      )
        .then((updatedUser) => res.send(updatedUser))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            return res.status(STATUS_CODES.BAD_REQUEST)
              .send({ message: ERROR_MESSAGES.INCORRECT_DATA });
          }
          return null;
        });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.USER_BY_ID_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_ID });
      }
      return sendDefaultServerError(err, res);
    });
};
