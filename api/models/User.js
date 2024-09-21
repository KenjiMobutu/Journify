import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    img: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["online", "offline", "do_not_disturb", "away"],
      default: "offline",
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    flightBookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "FlightBooking",
      },
    ],
    taxiBookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Taxi",
      },
    ],
    attractions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Attraction",
      },
    ],
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserChats",
      },
    ],
    blocked: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Friend",
      },
    ],
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    groupMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "GroupMember",
      },
    ],
    friendChats: [
      {
        type: Schema.Types.ObjectId,
        ref: "FriendChat",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
