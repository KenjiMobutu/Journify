import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
