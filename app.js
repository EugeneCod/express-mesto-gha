const express = require('express');
const mongoose = require('mongoose');
const console = require('console');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());

mongoose.connect(MONGO_URL);

app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  const err = new Error('Некорректный адрес или метод запроса');
  return res.status(404).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
