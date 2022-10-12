const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const sendUnknownServerError = (err, res) => res.status(500).send({ message: 'На сервере произошла ошибка', err });

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      sendUnknownServerError(err, res);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Ошибка валидации', error: err });
      }
      sendUnknownServerError(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      sendUnknownServerError(err, res);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      sendUnknownServerError(err, res);
    });
};

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => res.status(201).send(card))
  .catch((err) => {
    sendUnknownServerError(err, res);
  });
