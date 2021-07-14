const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  neighborhood: { type: String, required: true },
  photograph: { type: String, required: true },
  address: { type: String, required: true },
  latlng: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  image: { type: String, required: true },
  cuisine_type: { type: String, required: true },
  operating_hours: {
    Monday: { type: String },
    Tuesday: { type: String },
    Wednesday: { type: String },
    Thursday: { type: String },
    Friday: { type: String },
    Saturday: { type: String },
    Sunday: { type: String },
  }
}
);

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

module.exports = Restaurant;