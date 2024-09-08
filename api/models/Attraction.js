import mongoose from 'mongoose';
const { Schema } = mongoose;

const AttractionSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  city: {
    type: String,
  },
  price: {
    type: Number,
    required: true
  },
  ticketCount: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },

});

export default mongoose.model('Attraction', AttractionSchema);
