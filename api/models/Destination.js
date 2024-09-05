import mongoose from 'mongoose';
const { Schema } = mongoose;

const DestinationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hotels: [{
    type: Schema.Types.ObjectId,
    ref: 'Hotel'
  }]
});

export default mongoose.model('Destination', DestinationSchema);

