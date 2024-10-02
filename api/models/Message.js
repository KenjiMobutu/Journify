import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FriendChat",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Utilisé pour les messages privés
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Utilisé pour les messages de groupe
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "image", "video", "file"],
    default: "text",
  }, // Type de message
  img: { type: String }, // URL de l'image
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
