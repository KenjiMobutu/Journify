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
    required: true
  },
  endDate: {
    type: Date,
  },
  city: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Attraction', AttractionSchema);
