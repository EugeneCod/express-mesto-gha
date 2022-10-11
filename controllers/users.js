const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(201).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  // const { title, genre, directorId } = req.body;

  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};
