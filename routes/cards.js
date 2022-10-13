const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  toggleLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', toggleLikeCard);
router.delete('/:cardId/likes', toggleLikeCard);

module.exports = router;
