const router = require("express").Router();
const { check, body } = require("express-validator");

const User = require("../models/user");
const userController = require("../controllers/auth");

router.put(
  "/signup",
  [
    body("name").trim().not().isEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  userController.signup
);

router.post("/signin", userController.login);

module.exports = router;
