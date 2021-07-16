const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const usePasswordHashToMakeToken = require('../../config/auth');
const User = require('../../models/User');



router.post('/register', (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  };

  const { username, password } = req.body;

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


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Incorrect username/password' });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json({ message: 'You have to inser username and password' });
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }
      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
    });
  })(req, res, next);
});


router.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});


router.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});


router.post("/favourites", (req, res) => {
  User.findOne({ favourites: req.body.restaurantID, _id: req.body.userID })
    .then((result) => {
     
      if (result === null) {
        User.findByIdAndUpdate(req.body.userID, {
          $push: { favourites: req.body.restaurantID },
        })
          .then((res) => {
          
            res.status(200).json({ message: "Added to your favourites" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
    

        res.status({ message: "You already have this restaurant on your favourites" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
