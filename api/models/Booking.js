import mongoose from 'mongoose';
const { Schema } = mongoose;

const BookingSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  hotelName: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  adultsCount: {
    type: Number,

  },
  childrenCount: {
    type: Number,

  },
  rooms: {
    type: Number,

  },
  totalCost: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  numberOfNights: {
    type: Number,
    required: true
  },
  address: {
    type: String,
  },
  zip: {
    type: String,
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  canceled: {
    type: Boolean,
    default: false
  },
}, { timestamps: true }
);

export default mongoose.model('Booking', BookingSchema);
