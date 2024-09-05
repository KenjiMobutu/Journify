import mongoose from 'mongoose';
const { Schema } = mongoose;

const RoomSchema = new Schema({

  roomType: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Triple', 'Quad', 'Queen', 'King', 'Twin']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  people: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  photos:{
    type: [String],
  },
  roomNumbers: [{
    number: {
      type: Number,
      required: true // S'assurer que chaque chambre a un numéro
    },
    bookedDates: {
      type: [Date],
      default: [] // Initialisation par défaut pour éviter les valeurs nulles
    },
  }]
}, { timestamps: true});

export default mongoose.model('Room', RoomSchema);
