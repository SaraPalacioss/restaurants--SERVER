const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require("jsonwebtoken");


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


// router.post('/login', (req, res, next) => {

//   const { username, password } = req.body;

//   passport.authenticate('local', (err, theUser, failureDetails) => {
//     if (err) {
//       res.send({ message: 'Something went wrong authenticating user' }).status(500);
//       return;
//     };
//     if (!username | !password) {
//       res.send({ message: 'You have to introduce username & password' }).status(400);
//       return;
//     };
//     if (!theUser) {
//       res.send({ message: 'Incorrect username/password' }).status(400);
//       return;
//     };
//     req.login(theUser, (err) => {
//       if (err) {
//         res.send({ message: 'Session save went bad' }).status(500);
//         return;
//       };
//       res.status(200).json(theUser);
//     }
    
//     );
//   })(req, res, next);

// });


router.post("/login", (req, res) => {


  const { username, password } = req.body;

  // Find user by email
  User.findOne({ username }).then(user => {
 
    if (!username | !password) {
      res.send({ message: 'You have to introduce username & password' }).status(400);
      return;
    };
    if (!username) {
      res.send({ message: 'Incorrect username/password' }).status(400);
      return;
    };
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          username: user.username,
          favourites: user.favourites
        };

        // Sign token
        jwt.sign(
          payload,
          `${process.env.SECRET}`,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user
            })
            
           
            ;
            //     

          }
        )
   ;
        
      } else {
        return res.send({ message: 'Incorrect username/password' }).status(400);

      }

    });
  });
});


router.post('/logout', (req, res, next) => {
  req.logout();
  res.send({ message: 'Log out success!' }).status(200);
});


router.get('/loggedin', (req, res, next) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjFhMjA0MDYxOTY0NDYyNzRlMDNkMyIsInVzZXJuYW1lIjoiMTJAMTIuY29tIiwiZmF2b3VyaXRlcyI6WyI2MGYyYmZlNTkwOTFkYjkxZmVhZGIxZTUiLCI2MGY0MTZhMDQ0OWZhNDFhZGJjNDk5NGUiLG51bGwsIjYwZjM5MmViZjg0YTdhMDlmZjRkMjA1OCIsIjYwZjJiZmU1OTA5MWRiOTFmZWFkYjFjZCIsIjYwZjJiZmU1OTA5MWRiOTFmZWFkYjFkMSJdLCJpYXQiOjE2MjY2MzcyODgsImV4cCI6MTY1ODE5NDIxNH0.o4CFJReVE0irE7yVuVuTG2onjouYxPV_R6KAdYZLOUk';
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    User.findById(decoded.id, 
    { password: 0 }, // projection
    function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");
        
      res.json(user)
      
      next(user); // add this line
    });
  });
});



router.post('/favourites', (req, res) => {

  const { restaurantID, userID } = req.body;
  console.log(restaurantID)
  console.log(userID)
  User.findOne({ favourites: restaurantID, _id: userID })
    .then((result) => {
      if (result === null) {
        User.findByIdAndUpdate(userID, {
          $push: { favourites: restaurantID },
        })
          .then(() => { res.send({ message: "Added to your favourites" }).status(200); })
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

router.post('/get-user', (req, res) => {

  const { id } = req.body;
console.log(id)

  
  User.findById(id)
  
    .then(user => res.status(200).json(user)
    )
    .catch(err => res.status(500).json({ message: 'User data not found' }))


});

router.post('/deletefavourite', (req, res) => {
  const { restaurantID, userID } = req.body;
  User.findOne({ favourites: restaurantID, _id: userID })
    .then((result) => {
      if (result) {
        User.findByIdAndUpdate(userID, { $pullAll: { favourites: [restaurantID] } })
          .then(() => res.send({ message: "Remove from your favourites" }).status(200))
          .catch((err) => console.log(err))
      }
    })
    .catch((err) => console.log(err))

});



module.exports = router;
