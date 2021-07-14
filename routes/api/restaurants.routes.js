
const express = require('express');
const router = express.Router();

const Restaurant = require('../../models/Restaurants');


router.get('/', (req, res, next) => {
  Restaurant.find()
    .then(restaurant => {
      res.status(200).json(restaurant)
    })
    .catch(error => {
      res.status(500).json({ message: 'Something went wrong' })
    })
})

router.post('/new', (req, res, next) => {

  const { name, neighborhood, photograph, address, lat, lng, image, cuisine_type, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = req.body

  const newRestaurant = new Restaurant({
    name: name,
    neighborhood: neighborhood,
    photograph: photograph,
    address: address,
    latlng: {
      lat: lat,
      lng: lng,
    },
    image: image,
    cuisine_type: cuisine_type,
    operating_hours: {
      Monday: Monday,
      Tuesday: Tuesday,
      Wednesday: Wednesday,
      Thursday: Thursday,
      Friday: Friday,
      Saturday: Saturday,
      Sunday: Sunday,
    }
  })

  newRestaurant.save()
    .then(restaurant => {
      res.status(200).json(restaurant)
    })
    .catch(error => {
      res.status(500).json({ message: 'Error saving new Restaurant information' })
    })
})

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Restaurant.findById(id)
    .then(restaurant => {
      res.status(200).json(restaurant)
    })
    .catch(error => res.status(500).json({ message: 'Restaurant data not found' }))
})


router.post('/:id', (req, res, next) => {
  const { id } = req.params;
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => {
      res.status(200).json({ message: `Restaurant id ${id} updated` })
    })
    .catch(error => {
      res.status(500).json({ message: 'Something went wrong' })
    })
})


router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  Restaurant.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: `Restaurant subtitle ${id} deleted` }))
    .catch(error => res.status(500).json({ message: 'Something went wrong' }))

})



module.exports = router;
