import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserBookings,
  getUserFlightBookings,
  getUserTaxiBookings,
  getUserAttractions,
  deleteBooking,
  getUserChats,
  getByUsername,
  addFriends,
  getAllFriends,
  updateUserChat,
  findUserChatById,
  postUserChatMessage,
  findUserFriends,
  deleteFriend,
} from "../controllers/userController.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

router.get("/checkUser/:id", verifyUser, (req, res, next) => {
  res.send("User is verified");
});

//CREATE
//Voir authController.js

//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);
// Gestion des messages
router.post("/messages", verifyUser, postUserChatMessage);

// ADD Friend
router.post("/friends/add", verifyToken, addFriends);
router.get("/friends", verifyAdmin, getAllFriends);
router.delete("/friends/delete/:userId/:friendId", verifyUser, deleteFriend);
router.get("/userFriends/:id", verifyUser, findUserFriends);
router.get("/findUserChat/:userId/:friendId", verifyUser, findUserChatById);
router.put("/updateUserChat/:id", verifyUser, updateUserChat);

//get user by username
router.get("/search/:userName", verifyUser, getByUsername);

// Gestion des réservations d'un utilisateur
router.get("/:id/bookings", verifyUser, getUserBookings);
router.get("/:id/flightBookings", verifyUser, getUserFlightBookings);
router.get("/:id/taxiBookings", verifyUser, getUserTaxiBookings);
router.get("/:id/attractionBookings", verifyUser, getUserAttractions);

//DELETE A BOOKING
router.delete("/:userId/bookings/:id", verifyUser, deleteBooking);

//GET ALL
router.get("/", verifyAdmin, getAllUsers);

//GET
router.get("/:id", verifyUser, getUser);

//Get user chats
router.get("/chats/:id", verifyUser, getUserChats);

export default router;
