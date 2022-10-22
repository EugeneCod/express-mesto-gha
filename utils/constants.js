const STATUS_CODES = {
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INCORRECT_DATA: 'Переданы некорректные данные',
  INCORRECT_AUTHORIZATION_DATA: 'Неправильные почта или пароль',
  INCORRECT_ID: 'Введен некорректный id',
  CARD_BY_ID_NOT_FOUND: 'Карточка с указанным id не найдена',
  USER_BY_ID_NOT_FOUND: 'Пользователь с указанным id не найден',
  DEFAULT_SERVER_ERROR: 'На сервере произошла ошибка',
};

module.exports = {
  STATUS_CODES,
  ERROR_MESSAGES,
};
