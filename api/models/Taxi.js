import mongoose from "mongoose";
const { Schema } = mongoose;

const TaxiSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    departure: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    arrival: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
    },
    photos: {
      type: [String],
    },
    paid: {
      type: Boolean,
      default: false
    },
    canceled: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model("Taxi", TaxiSchema);
