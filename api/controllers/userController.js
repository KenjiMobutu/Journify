import User from "../models/User.js";
import Friend from "../models/Friend.js";
import Message from "../models/Message.js";
import FriendChat from "../models/FriendChat.js";
import Group from "../models/Group.js";
import bcrypt from "bcryptjs";

// Create User
export const createUser = async (req, res, next) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    next(err);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    next(err);
  }
};

// Get User
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Get All Users
export const getAllUsers = async (req, res, next) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (err) {
    next(err);
  }
};

// Get User Bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("bookings");
    res.status(200).json(user.bookings);
  } catch (err) {
    next(err);
  }
};

//Delete a user booking
export const deleteBooking = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    user.bookings.pull(req.params.id);
    await user.save();
    res.status(200).json("Booking has been deleted...");
  } catch (err) {
    next(err);
  }
};

// Get User Flight Bookings
export const getUserFlightBookings = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("flightBookings");
    res.status(200).json(user.flightBookings);
  } catch (err) {
    next(err);
  }
};

// Get User Taxi Bookings
export const getUserTaxiBookings = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("taxiBookings");
    res.status(200).json(user.taxiBookings);
  } catch (err) {
    next(err);
  }
};

// Get User Attractions
export const getUserAttractions = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("attractions");
    res.status(200).json(user.attractions);
  } catch (err) {
    next(err);
  }
};

// ADD Friend
export const addFriend = async (req, res, next) => {
  try {
    const { userId, friendEmail } = req.body;

    // Rechercher l'utilisateur correspondant à cet email
    const friend = await User.findOne({ email: friendEmail });
    if (!friend) {
      return res.status(404).json({ error: "User not found" });
    }

    // Vérifier si une relation d’amitié existe déjà
    const existingFriendship = await Friend.findOne({
      $or: [
        { userId: userId, friendId: friend._id },
        { userId: friend._id, friendId: userId },
      ],
    });

    if (existingFriendship) {
      return res
        .status(400)
        .json({ error: "Friendship already exists or is pending" });
    }

    // Créer une relation d’amitié
    const newFriendship = await Friend.create({
      userId: userId,
      friendId: friend._id,
    });

    // Envoyer une notification via socket.io
    const io = req.app.get("socketio");
    const friendSocketId = friend._id.toString();

    io.to(friendSocketId).emit("friendAdded", {
      message: "You have a new friend request!",
      friendId: userId,
    });

    // Répondre au client
    res.status(201).json({ message: "Friend request sent", newFriendship });
  } catch (err) {
    next(err);
  }
};

// Get user by username
export const getByUsername = async (req, res, next) => {
  const { userName } = req.params;

  // Vérifie si le paramètre userName est fourni
  if (!userName) {
    return res.status(400).json({ error: "userName parameter is required" });
  }

  try {
    // Recherche de l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ userName });

    // Si l'utilisateur n'existe pas, renvoyer une réponse appropriée
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Réponse avec les détails de l'utilisateur
    res.status(200).json(user);
  } catch (err) {
    // Gérer les erreurs
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};

// Get user chats
export const getUserChats = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("friendChats");
    res.status(200).json(user.chats);
  } catch (err) {
    next(err);
  }
};

// add friend
export const addFriends = async (req, res, next) => {
  try {
    const { user, friend } = req.body;
    console.log(user, friend);

    if (user === friend) {
      return res
        .status(400)
        .json({ error: "You cannot add yourself as a friend" });
    }

    // Rechercher l'utilisateur correspondant à cet email
    const friendToAdd = await User.findOne({ _id: friend });
    if (!friendToAdd) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingFriendship = await Friend.findOne({
      $or: [
        { user: user, friend: friend },
        { user: friend, friend: user },
      ],
    });

    if (existingFriendship) {
      return res
        .status(400)
        .json({ error: "Friendship already exists or is pending" });
    }

    const newFriendship = await Friend.create({ user, friend });

    res.status(201).json({ message: "Friend request sent", newFriendship });
  } catch (err) {
    next(err);
  }
};

// Get all FRIENDSHIPS
export const getAllFriends = async (req, res, next) => {
  try {
    const friends = await Friend.find();
    console.log(friends);
    res.status(200).json(friends);
  } catch (err) {
    next(err);
  }
};

// Get user friends
export const findUserFriends = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Rechercher les relations d'amitié où l'utilisateur est soit le 'user', soit le 'friend'
    const friends = await Friend.find({
      $or: [
        { user: id }, // L'utilisateur est le principal
        { friend: id }, // L'utilisateur est l'ami
      ],
    }).populate("user friend"); // Populer à la fois 'user' et 'friend'

    res.status(200).json(friends);
  } catch (err) {
    next(err);
  }
};

// Get user by chat id
export const findUserChatById = async (req, res, next) => {
  try {
    const { userId, friendId } = req.params;
    let chat = await FriendChat.findOne({
      members: { $all: [userId, friendId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, // Sort messages by creation time
    });

    if (!chat) {
      // If no chat exists, create an empty chat
      chat = new FriendChat({ members: [userId, friendId], messages: [] });
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
  }
};

export const findGroupChatById = async (req, res, next) => {
  try {
    const { userId, groupId } = req.params;
    let chat = await Message.findOne({
      senderId: userId,
      groupId: groupId,
    }).populate({ path: "messages", options: { sort: { createdAt: 1 } } });

    if (!chat) {
      chat = new Message({
        senderId: userId,
        groupId: groupId,
        content: "",
      });
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
  }
};

// Update user chat by chat id
export const updateUserChat = async (userId, update) => {
  try {
    const chat = await User.findByIdAndUpdate(userId, update, { new: true });
    return chat;
  } catch (err) {
    console.error(err);
  }
};

// Post user chat message
export const postUserChatMessage = async (req, res, next) => {
  try {
    const { senderId, receiverId, content, createdAt, img } = req.body;

    // Find or create a chat between the two users
    let chat = await FriendChat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new FriendChat({ members: [senderId, receiverId] });
      await chat.save();
    }

    // Créez le message et obtenez l'ObjectId du message
    const newMessage = new Message({
      chatId: chat._id,
      senderId,
      receiverId,
      content: content || "",
      createdAt: createdAt || Date.now(),
      img: img || null,
    });

    // Sauvegarder le nouveau message et obtenir son ObjectId
    const savedMessage = await newMessage.save();

    chat.messages.push(savedMessage);
    await chat.save();

    res.status(201).json(savedMessage);
  } catch (err) {
    next(err);
  }
};

// Delete friend
export const deleteFriend = async (req, res, next) => {
  try {
    const { userId, friendId } = req.params;

    // Rechercher et supprimer la relation d'amitié
    await Friend.findOneAndDelete({
      $or: [
        { user: userId, friend: friendId },
        { user: friendId, friend: userId },
      ],
    });

    res.status(200).json({ message: "Friend deleted" });
  } catch (err) {
    next(err);
  }
};

// Delete user chat
export const deleteUserChat = async (req, res, next) => {
  try {
    const { userId, friendId } = req.params;

    // Rechercher et supprimer le chat
    await FriendChat.findOneAndDelete({
      members: { $all: [userId, friendId] },
    });

    res.status(200).json({ message: "Chat deleted" });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    // Valider si le statut est dans les options valides
    if (!["online", "offline", "do_not_disturb", "away"].includes(status)) {
      return res.status(400).json({ message: "Statut non valide." });
    }

    // Mettre à jour le statut de l'utilisateur
    const user = await User.findByIdAndUpdate(
      userId,
      { status: status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Statut mis à jour avec succès", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du statut", error });
  }
};

// Create group
export const createGroup = async (req, res, next) => {
  try {
    const { groupName, members, creatorId } = req.body;

    // Créer un groupe avec le nom et les membres fournis
    const newGroup = await Group.create({
      groupName,
      members,
      creatorId,
    });

    res.status(201).json(newGroup);
  } catch (err) {
    next(err);
  }
};

// Get user groups
export const getUserGroups = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Rechercher les groupes où l'utilisateur est membre ou créateur
    const groups = await Group.find({
      $or: [
        { members: userId }, // L'utilisateur est membre du groupe
        { creatorId: userId }, // L'utilisateur est le créateur du groupe
      ],
    }).populate("members", "userName img"); // Optionnel : pour peupler les membres avec des informations supplémentaires

    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

// Delete group
export const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Groupe supprimé" });
  } catch (err) {
    next(err);
  }
};

// Delete member from group
export const deleteMemberGroup = async (req, res, next) => {
  try {
    const { groupId, userId } = req.params;

    // Rechercher et mettre à jour le groupe
    // const group = await Group.findById(groupId);
    // group.members.pull(userId);
    // await group.save();
    // Retirer le membre du groupe
    await Group.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    );

    res.status(200).json({ message: "Membre supprimé du groupe" });
  } catch (err) {
    next(err);
  }
};

// Get group by id
export const getGroupById = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate(
      "members",
      "userName img"
    );
    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
};
