const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { check, validationResult } = require("express-validator");

exports.signup = (req, res, next) => {
  // validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        password: hashPassword,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created successfully!",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user Email can not be found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "somesupersecretsecret",
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
