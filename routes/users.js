const router = require('express').Router();
const {
  getUsers,
  getUser,
  getAuthorizedUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthorizedUser);
router.get('/:userId', getUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
