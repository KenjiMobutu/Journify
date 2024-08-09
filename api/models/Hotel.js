import mongoose from 'mongoose';
const { Schema } = mongoose;

const HotelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type:{
    type: String,
    required: true,
    enum: ['Hotel', 'Hostel', 'Guest House', 'Resort', 'Motels', 'Bed & Breakfast']
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    maxlength: 100
  },
  address: {
    type: String,
    required: true,
    maxlength: 100
  },
  distance: {
    type: Number,
    required: true
  },
  photos:{
    type: [String],

  },
  featured:{
    type: Boolean,
    default: false
  },
  // destination: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Destination'
  // },
  // rooms: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Room'
  // }],
  rooms:{
    type:[String],
  },

});

export default mongoose.model('Hotel', HotelSchema); // Export the model using the Schema.
