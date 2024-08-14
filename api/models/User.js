import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  img:{
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }
);

export default mongoose.model('User', UserSchema);
