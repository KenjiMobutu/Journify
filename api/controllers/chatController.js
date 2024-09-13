import User from "../models/User.js";
import UserChats from "../models/UserChats.js";
import Chat from "../models/Chat.js";

// Create a new chat
export const postChat = async (req, res) => {
  const { userId, text } = req.body;
  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    const userChats = await UserChats.find({ userId: userId });

    if (userChats.length === 0) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 20),
          },
        ],
      });
      await newUserChats.save();
    } else {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            chats: { _id: savedChat._id, title: text.substring(0, 20) },
          },
        }
      );
      res.status(201).send(newChat);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get last chats for a user
export const getChat = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const chats = await Chat.find({ _id: { $in: user.chats } });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
