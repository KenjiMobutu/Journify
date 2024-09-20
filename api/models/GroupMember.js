import mongoose from "mongoose";
const groupMemberSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: { type: String, enum: ["member", "admin"], default: "member" },
  joinedAt: { type: Date, default: Date.now },
});

const GroupMember = mongoose.model("GroupMember", groupMemberSchema);

export default GroupMember;
