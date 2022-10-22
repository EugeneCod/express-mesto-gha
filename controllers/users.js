const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

module.exports.getAuthorizedUser = (req, res) => {
  User.findById(req.user._id).orFail(new Error('NotFoundError'))
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
  bcrypt.hash(req.body.password, 7)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
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
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('NotFoundError'))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.USER_BY_ID_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_DATA });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_ID });
      }
      return sendDefaultServerError(err, res);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('NotFoundError'))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.USER_BY_ID_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_DATA });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_ID });
      }
      return sendDefaultServerError(err, res);
    });
};

module.exports.login = (req, res) => {
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
      // res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'IncorrectEmailOrPassword') {
        return res.status(STATUS_CODES.UNAUTHORIZED)
          .send({ message: ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA });
      }
      return sendDefaultServerError(err, res);
    });
};

// module.exports.login = (req, res) => {
//   const { email, password } = req.body;

//   User.findOne({ email }).orFail(new Error('IncorrectEmailOrPassword'))
//     .then((user) => bcrypt.compare(password, user.password))
//     .then((matched) => {
//       if (!matched) {
//         return Promise.reject(new Error('IncorrectEmailOrPassword'));
//       }
//       return res.send({ message: 'Всё верно!' });
//     })
//     .catch((err) => {
//       if (err.message === 'IncorrectEmailOrPassword') {
//         return res.status(STATUS_CODES.UNAUTHORIZED)
//           .send({ message: ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA });
//       }
//       return sendDefaultServerError(err, res);
//     });
// };
