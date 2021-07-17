const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');



router.post('/register', (req, res) => {

  const { username, password } = req.body;

  User.findOne({ username: username }).then(user => {
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    } else if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimun length is 6 characters' });
    } else {
      const newUser = new User({
        username: username,
        password: password
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

  const {username, password} = req.body;

  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong authenticating user' });
      return;
    };
    if(!username | !password) {
      res.status(400).json({ message: 'You have to introduce username & password' });
      return;
    };
    if (!theUser) {
      res.status(400).json({ message: 'Incorrect username/password' });
      return;
    };
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad' });
        return;
      };
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
  }; 

  res.status(403).json({ message: 'Unauthorized' });

});


router.post("/favourites", (req, res) => {

  const {restaurantID, userID} = req.body;

  User.findOne({ favourites: restaurantID, _id: userID })
    .then((result) => {
      if (result === null) {
        User.findByIdAndUpdate(userID, {
          $push: { favourites: restaurantID },
        })
          .then(() => {
            res.status(200).json({ message: "Added to your favourites" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.status(400).json({ message: "You already have this restaurant on your favourites" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
    
});

module.exports = router;
