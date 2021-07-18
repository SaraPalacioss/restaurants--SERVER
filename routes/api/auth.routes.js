const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');



router.post('/register', (req, res) => {

  const { username, password } = req.body;

  User.findOne({ username: username }).then(user => {
    if (user) {
      return res.send({ message: 'Username already exists' }).status(400);
    } else if (password.length < 6) {
      return res.send({ message: 'Password minimun length is 6 characters' }).status(400);
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
      res.send({ message: 'Something went wrong authenticating user' }).status(500);
      return;
    };
    if(!username | !password) {
      res.send({ message: 'You have to introduce username & password' }).status(400);
      return;
    };
    if (!theUser) {
      res.send({ message: 'Incorrect username/password' }).status(400);
      return;
    };
    req.login(theUser, (err) => {
      if (err) {
        res.send({ message: 'Session save went bad' }).status(500);
        return;
      };
      res.status(200).json(theUser);
    });
  })(req, res, next);

});


router.post('/logout', (req, res, next) => {
  req.logout();
  res.send({ message: 'Log out success!' }).status(200);
});


router.get('/loggedin', (req, res, next) => {

  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }; 

  res.send({ message: 'Unauthorized' }).status(403);

});


router.post('/favourites', (req, res) => {

  const {restaurantID, userID} = req.body;
console.log(restaurantID)
console.log(userID)
  User.findOne({ favourites: restaurantID, _id: userID })
    .then((result) => {
      if (result === null) {
        User.findByIdAndUpdate(userID, {
          $push: { favourites: restaurantID },
        })
          .then(() => {
            res.send({ message: "Added to your favourites" }).status(200);
            console.log(userID )
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.send({ message: "You already have this restaurant on your favourites" }).status(400);
      }
    })
    .catch((err) => {
      console.log(err);
    });
    
});




router.post('/deletefavourite', (req, res) =>{
  const {restaurantID, userID} = req.body;
  User.findOne({ favourites: restaurantID, _id: userID })
  .then((result) => {
    if (result) {
      User.findByIdAndUpdate(userID, { $pullAll: { favourites: [ restaurantID ] }})
        .then(() => {
          res.send({ message: "Remove from your favourites" }).status(200);
        })
        .catch((err) => {
          console.log(err);
        });
    } 
  })
  .catch((err) => {
    console.log(err);
  })

})
  
  


module.exports = router;
