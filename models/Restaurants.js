const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  neighborhood: { type: String},
  address: { type: String },
  address: { type: String },
  latlng: {
    lat: { type: Number },
    lng: { type: Number },
  },
  image: { type: String , default: 'https://images.assetsdelivery.com/compings_v2/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016.jpg'},
  cuisine_type: { type: String },
  operating_hours: {
    monday: { type: String },
    tuesday: { type: String },
    wednesday: { type: String },
    thursday: { type: String },
    friday: { type: String },
    saturday: { type: String },
    sunday: { type: String },
  },
  reviews: [{
    name: { type: String },
    date: {  type: String },
    rating: { type: Number },
    comments: { type: String }
  }]
}
);

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

module.exports = Restaurant;