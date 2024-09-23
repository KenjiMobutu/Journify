import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  createdAt: { type: Date, default: Date.now },
  img: { type: String, default: "" },
  isGroup: { type: Boolean, default: true },
});

const Group = mongoose.model("Group", groupSchema);

export default Group;