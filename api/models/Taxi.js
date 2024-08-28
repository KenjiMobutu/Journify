import mongoose from 'mongoose';
const { Schema } = mongoose;

const TaxiSchema = new Schema({

  name: {
    type: String,
    required: true,
    unique: true
  },
  type:{
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  departure: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  arrival: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
  },
  photos:{
    type: [String],
  },

}, { timestamps: true});

export default mongoose.model('Taxi', TaxiSchema);
