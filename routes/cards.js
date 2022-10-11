const router = require('express').Router();

router.get('/users', (req, res) => {
  res.send('Выводим список пользователей');
});

router.get('/users/:userId', (req, res) => {
  res.send('Выводим пользователя по ID');
});

router.post('/users', (req, res) => {
  res.send('добавляем пользователя в БД');
});

module.exports = router;
