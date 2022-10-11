const express = require('express');
const mongoose = require('mongoose');
const console = require('console');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6345cf9384b34b37b11f0dea',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// 6345cf9384b34b37b11f0dea - ID авторизованного пользователя
