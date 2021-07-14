const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    id: {type: Number},
    name: {type: String},
    neighborhood: {type: String},
    photograph: {type: String},
    address: {type: String},
    latlng: {
      lat: {type: Number},
      lng: {type: Number},
    },
    image:{type: String},
    cuisine_type: {type: String},
    operating_hours: {
      Monday: {type: String},
      Tuesday: {type: String},
      Wednesday: {type: String},
      Thursday: {type: String},
      Friday: {type: String},
      Saturday: {type: String},
      Sunday: {type: String},
    },
    reviews: [{
      name: {type: String},
      date: {type: Date},
      rating: {type: Number},
      comments: {type: String}
    }]
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

module.exports = Restaurant;