const express                     = require('express');
const router                      = express.Router();
const passport = require('passport');

const bcrypt                      = require('bcryptjs');
const jwt                         = require('jsonwebtoken');
const validateRegisterInput       = require('../../validation/register');
const validateLoginInput          = require('../../validation/login');
const usePasswordHashToMakeToken  = require('../../config/auth');
const User = require('../../models/User');


router.post('/register', (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  };

  const {username, password} = req.body;

  User.findOne({ username: username }).then(user => {

    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    } else if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimun length is 6 characters' });
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    };
  });
});


router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.send({ message: "You have to introduce username & password" });
      return;
    }
    if (err) {
      res.send({ message: "Error authenticating user" });
      return;
    }
    if (!theUser) {
      res.send({ message: "Incorrect username/password" });
      return;
    }
    req.login(theUser, (err) =>
      err
        ? res.send({ message: "Incorrect username/password" })
        : res.status(200).json(theUser)
    );
  })(req, res, next);
});

router.get("/loggedin", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.json({});
});

router.post("/logout", (req, res, next) => {
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});



module.exports = router;
