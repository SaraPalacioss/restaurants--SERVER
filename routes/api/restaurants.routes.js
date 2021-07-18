
const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/Restaurants');


router.get('/', (req, res, next) => {

  Restaurant.find()
    .then(restaurant => res.status(200).json(restaurant))
    .catch(err => res.status(500).json({ message: 'Something went wrong' }))

});


router.post('/new', (req, res, next) => {

  const { name, neighborhood, address, lat, lng, image, cuisine_type, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body
 
  if(!name) {
    res.send({ message: 'You have to introduce a name' }).status(400);
    return;
  };

  const newRestaurant = new Restaurant({
    name: name,
    neighborhood: neighborhood,
    address: address,
    latlng: {
      lat: lat,
      lng: lng,
    },
    image: image,
    cuisine_type: cuisine_type,
    operating_hours: {
      monday: monday,
      tuesday: tuesday,
      wednesday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
      sunday: sunday,
    }
  });

  newRestaurant.save()
    .then(restaurant => res.send({ message: `New restaurant created` }).status(200))
    .catch(err => res.status(500).json({ message: 'Error saving new Restaurant information' })
    )

});


router.get('/:id', (req, res, next) => {

  const { id } = req.params;

  Restaurant.findById(id)
    .then(restaurant => res.send({ message: `Restaurant info updated` }).status(200))
    .catch(err => res.status(500).json({ message: 'Restaurant data not found' }))

});


router.get('/myfavourites', (req, res, next) => {

  const { id } = req.body;

  Restaurant.findById(id)
    .then(restaurant => res.status(200).json(restaurant)
    )
    .catch(err => res.status(500).json({ message: 'Restaurant data not found' }))

});


router.post('/:id', (req, res, next) => {

  const { id } = req.params;

  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.send({ message: `Restaurant id ${id} updated` }).status(200))
    .catch(err => res.send({ message: `Something went wrong. Try again` }).status(500))

});


router.delete('/:id', (req, res, next) => {

  const { id } = req.params;
  Restaurant.findByIdAndDelete(id)
    .then(() => res.send({ message: `Restaurant subtitle ${id} deleted` }).status(200))
    .catch(err => res.send({ message: `Something went wrong. Try again` }).status(500))

});


module.exports = router;
