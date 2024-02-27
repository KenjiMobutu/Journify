import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // bookings: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Booking'
  // }]
});

export default mongoose.model('User', UserSchema);
