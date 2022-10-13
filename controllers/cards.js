const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

function sendDefaultServerError(err, res) {
  return res.status(500).send(
    { message: 'На сервере произошла ошибка' },
  );
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      sendDefaultServerError(err, res);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      sendDefaultServerError(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId).orFail(new Error('NotFoundError'))
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => res.status(200).send(removedCard));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Введен некорректный id' });
      }
      if (err.message === 'NotFoundError') {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      return sendDefaultServerError(err, res);
    });
};

function selectOperatorForLikes(req) {
  return req.method === 'PUT'
    ? { $addToSet: { likes: req.user._id } } // добавить _id в массив, если его там нет
    : { $pull: { likes: req.user._id } }; // убрать _id из массива
}

module.exports.toggleLikeCard = (req, res) => {
  Card.findById(req.params.cardId).orFail(new Error('NotFoundError'))
    .then(() => {
      Card.findByIdAndUpdate(
        req.params.cardId,
        selectOperatorForLikes(req),
        { new: true },
      )
        .then((updatedCard) => res.status(200).send(updatedCard));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Введен некорректный id' });
      }
      if (err.message === 'NotFoundError') {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      return sendDefaultServerError(err, res);
    });
};
