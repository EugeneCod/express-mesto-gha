const { default: mongoose } = require('mongoose');
const User = require('../models/user');

function sendDefaultServerError(err, res) {
  return res.status(500).send(
    { message: 'На сервере произошла ошибка' },
  );
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      sendDefaultServerError(err, res);
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFoundError'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Введен некорректный id' });
      }
      if (err.message === 'NotFoundError') {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
      return sendDefaultServerError(err, res);
    });
};

module.exports.createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
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
        .then((updatedUser) => res.status(200).send(updatedUser))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({ message: 'Переданы некорректные данные' });
          }
          return null;
        });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Введен некорректный id' });
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
        .then((updatedUser) => res.status(200).send(updatedUser))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({ message: 'Переданы некорректные данные' });
          }
          return null;
        });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Введен некорректный id' });
      }
      return sendDefaultServerError(err, res);
    });
};
