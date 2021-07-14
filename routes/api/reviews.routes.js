
const express = require('express');
const router = express.Router();

const { populate } = require("../../models/User");

const Reviews = require('../../models/Reviews');


router.get('/', (req, res, next) => {

  Reviews.find()
  .populate('User')
    .then(review => {
      res.status(200).json(review)
    })
    .catch(error => {
      res.status(500).json({ message: 'Something went wrong' })
    })
})

router.post('/new', (req, res, next) => {

  const { userID, restaurantID, name, rating, comments } = req.body

  const newReviews = new Reviews({
    userID: userID,
    restaurantID: restaurantID,
    name: name,
    rating: rating,
    comments: comments
  })

  newReviews.save()
    .then(review => {
      res.status(200).json(review)
    })
    .catch(error => {
      res.status(500).json({ message: 'Error saving new Reviews information' })
    })
})

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Reviews.findById(id)
    .then(review => {
      res.status(200).json(Reviews)
    })
    .catch(error => res.status(500).json({ message: 'Reviews data not found' }))
})


router.post('/:id', (req, res, next) => {
  const { id } = req.params;
  Reviews.findByIdAndUpdate(id, req.body)
    .then(() => {
      res.status(200).json({ message: `Reviews id ${id} updated` })
    })
    .catch(error => {
      res.status(500).json({ message: 'Something went wrong' })
    })
})


router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  Reviews.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: `Reviews subtitle ${id} deleted` }))
    .catch(error => res.status(500).json({ message: 'Something went wrong' }))

})



module.exports = router;
