const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/unauthorized');
const { ERROR_MESSAGES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив-Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'IncorrectEmailFormat',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // запрет на отправку поля
  },
}, { versionKey: false });

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').orFail(new UnauthorizedError(ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA);
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);

// {
//   "email": "aaaaaaaaaa@ddddd.ru",
//   "password": "AAA123jjj456"
// }
