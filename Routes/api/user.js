const express = require("express");
const router = express.Router();
const bcrypyt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
//Item model
const User = require("../../Models/User");

// @route POST api/items
// @desc post a items
// @access Public

router.post("/", auth, (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) res.status(404).send("email already exist");
    else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      //  password hashing
      bcrypyt.genSalt(10, (err, salt) => {
        bcrypyt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) =>
              // jwt code
              jwt.sign(
                { id: user.id },
                config.get("jwtSecret"),
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) throw err;
                  res.status(200).json({ token, user });
                }
              )
            )

            .catch((err) => res.json(err));
        });
      });
    }
  });
});

// @route GET api/user
// @desc get all user
// @access Public

router.get("/", (req, res) => {
  User.find()
    .sort({ date: -1 })
    .then((user) => res.status(200).json(user))
    .catch((err) => console.log(err));
});

// AUTHENTICATION

router.post("/auth", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) res.status(404).send("User doesnot exist");
    bcrypyt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).send("wrong password");
      jwt.sign(
        { id: user.id },
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token, user });
        }
      );
    });
  });
});
module.exports = router;
