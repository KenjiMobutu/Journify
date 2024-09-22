import mongoose from 'mongoose';
const { Schema } = mongoose;

const FlightBookingSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  departureAirport: {
    type: String,
    required: true
  },
  arrivalAirport: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  adultsCount: {
    type: Number,

  },
  childrenCount: {
    type: Number,
    
  },
  cabinClass: {
    type: String,
  },
  totalCost: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
}, { timestamps: true }
);

export default mongoose.model('FlightBooking', FlightBookingSchema);
