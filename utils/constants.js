const STATUS_CODES = {
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  AUTHORIZATION_REQUIRED: 'Необходима авторизация',
  INCORRECT_DATA: 'Переданы некорректные данные',
  INCORRECT_EMAIL: 'Некорректный формат почты',
  INCORRECT_AUTHORIZATION_DATA: 'Неправильные почта или пароль',
  INCORRECT_ID: 'Введен некорректный id',
  CARD_BY_ID_NOT_FOUND: 'Карточка с указанным id не найдена',
  USER_BY_ID_NOT_FOUND: 'Пользователь с указанным id не найден',
  DEFAULT_SERVER_ERROR: 'На сервере произошла ошибка',
  REJECT_CARD_DELETION: 'Отказ в удалении карточки другого пользователя',
  CONFLICT_WITH_THE_USER_BASE: 'Пользователь с таким email уже зарегистрирован',
  INVALID_ADDRESS_OR_METHOD: 'Некорректный адрес или метод запроса',
};

module.exports = {
  STATUS_CODES,
  ERROR_MESSAGES,
};
