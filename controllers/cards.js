const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const { STATUS_CODES, ERROR_MESSAGES } = require('../utils/constants');

function sendDefaultServerError(err, res) {
  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(
    { message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR },
  );
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      sendDefaultServerError(err, res);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODES.CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_DATA });
      }
      sendDefaultServerError(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId).orFail(new Error('NotFoundError'))
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => res.send(removedCard));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_ID });
      }
      if (err.message === 'NotFoundError') {
        return res.status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.CARD_BY_ID_NOT_FOUND });
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
        .then((updatedCard) => res.send(updatedCard));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INCORRECT_ID });
      }
      if (err.message === 'NotFoundError') {
        return res.status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.CARD_BY_ID_NOT_FOUND });
      }
      return sendDefaultServerError(err, res);
    });
};
