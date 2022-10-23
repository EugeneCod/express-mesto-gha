const Card = require('../models/card');
const { STATUS_CODES, ERROR_MESSAGES } = require('../utils/constants');

const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODES.CREATED).send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError(ERROR_MESSAGES.CARD_BY_ID_NOT_FOUND))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.REJECT_CARD_DELETION);
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => res.send(removedCard));
    })
    .catch(next);
};

function selectOperatorForLikes(req) {
  return req.method === 'PUT'
    ? { $addToSet: { likes: req.user._id } } // добавить _id в массив, если его там нет
    : { $pull: { likes: req.user._id } }; // убрать _id из массива
}

module.exports.toggleLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    selectOperatorForLikes(req),
    { new: true },
  ).orFail(new NotFoundError(ERROR_MESSAGES.CARD_BY_ID_NOT_FOUND))
    .then((updatedCard) => res.send(updatedCard))
    .catch(next);
};
