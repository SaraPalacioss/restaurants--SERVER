const express                     = require('express');
const router                      = express.Router();
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
    } else if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimun length is 8 characters' });
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


router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  };

  const {username, password} = req.body;

  User.findOne({ username }).then(user => {

    if (!username && !password) {
      return res.status(404).json({ message: 'Incorrect username/password' });

    }
    if (!user) {
      return res.status(404).json({ message: 'Incorrect username/password' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimun length is 8 characters' });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {

        const payload = {
          id: user.id,
          alias: user.alias
        };

        jwt.sign(
          payload,
          process.env.SECRET,
          {
            expiresIn: 31556926
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: 'Incorrect username/password' });
      }
    });
  });
});


router.post('/user/reset/password', (req, res) => {

  const { username } = req.body

  User.findOne({ username })

    .then(user => {

      const token = usePasswordHashToMakeToken(user)
      const url = `${process.env.URLRESET}/password/reset/${user.id}/${token}`
      res.status(200).json(url)

    })

    .catch(err => {
      res.status(404).json({message: 'No user with that username'})

    })

})


router.post('/user/change/password', (req, res) => {

  const { username, password, newPassword, newPassword2 } = req.body
  User.findOne({ username })

    .then(user => {
      const token = usePasswordHashToMakeToken(user)
      const url = `${process.env.URLRESET}/password/reset/${user.id}/${token}`


      if (!password || !newPassword || !newPassword2) {
        res.status(400).json({ message: 'You have to complete all the fields' });
      }

      if (newPassword != newPassword2) {
        res.status(400).json({ message: 'The new password is not the same' });

      }

      if (newPassword.length < 8 || newPassword2.length < 8) {
        return res.status(400).json({ message: 'Password minimun length is 8 characters' });
      }

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {

          res.status(200).json({ url: url })
        } else {
          return res
            .status(400)
            .json({ message: 'Incorrect password' });
        }
      })

    })

    .catch(err => {
      res.json({ message: 'No user with this username' });
    })

})



router.post('/password/reset/:userId/:token', (req, res) => {
  const { userId, token } = req.params
  const { password } = req.body

  User.findOne({ _id: userId })


    .then(user => {
      const secret = user.password + '-' + user.createdAt
      const payload = jwt.decode(token, secret)
      const currentPassword = user.password

      if (password.length < 8) {
        return res.status(400).json({ message: 'Password minimun length is 8 characters' });
      }
  
      
      bcrypt.compare(password, currentPassword)
        .then(isMatch => {
          if (isMatch) {
            res.status(400).json({ message: 'The new password cannot be the current password' });
          } else {
            if (payload.userId === user.id) {
              bcrypt.genSalt(10, function (err, salt) {
                if (err) return
                bcrypt.hash(password, salt, function (err, hash) {
                  if (err) return
                  User.findOneAndUpdate({ _id: userId }, { password: hash })
                    .then(() => { res.status(200).json({message: 'Password changed accepted'}) })
                    .catch(err => res.status(500).json(err))
                })
              })
            }
          }
        })

    })

    .catch(() => {
      res.status(404).json('Invalid user')
    })
})



module.exports = router;
