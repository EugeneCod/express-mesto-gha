const { default: mongoose } = require('mongoose');
const User = require('../models/user');

function sendDefaultServerError(err, res) {
  return res.status(500).send(
    { message: 'На сервере произошла ошибка' },
  );
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(201).send({ data: users }))
    .catch((err) => {
      sendDefaultServerError(err, res);
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Введен некорректный ID' });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь с указанным ID не найден' });
      }
      return sendDefaultServerError(err, res);
    });
};

module.exports.createUser = (req, res) => {
  User.create(req.body).orFail(new Error('IncorrectData'))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Введен некорректный ID' });
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
  )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      sendUnknownServerError(err, res);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upset: true,
    },
  )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      sendUnknownServerError(err, res);
    });
};
