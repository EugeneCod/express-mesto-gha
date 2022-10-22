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

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6345cf9384b34b37b11f0dea',
//   };

//   next();
// });

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

// jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzU0MDkyMDU3Y2MxOTEyMzA1Mjk3YTMiLCJpYXQiOjE2NjY0NTI1MjUsImV4cCI6MTY2NzA1NzMyNX0
// .yVPqO9ixsEXh5_3fbBehHgmBAhfiZxytqLXRWqU05TQ;
// Max-Age=604800; Path=/; Expires=Sat, 29 Oct 2022 15:28:45 GMT; HttpOnly; SameSite=Strict
