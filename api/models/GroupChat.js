import mongoose from "mongoose";
const { Schema } = mongoose;

const GroupChatSchema = new Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId, // Assurez-vous que c'est un ObjectId
    ref: "Group", // La collection Group à laquelle il fait référence
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Liste des utilisateurs
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Liste des messages liés
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("GroupChat", GroupChatSchema);
