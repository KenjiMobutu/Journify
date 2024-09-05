import express from 'express';
import { createUser,
          updateUser,
          deleteUser,
          getUser,
          getAllUsers,
          getUserBookings,
          getUserFlightBookings,
          getUserTaxiBookings,
        } from '../controllers/userController.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

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

// router.get("/checkToken", verifyToken, (req, res, next) => {
//   res.send("Token is valid");
//   //res.status(200).json(req.user);
// });

router.get("/checkUser/:id", verifyUser, (req, res, next) => {
  res.send("User is verified");
});

// router.get("/checkAdmin/:id", verifyAdmin, (req, res, next) => {
//   res.send("Admin is verified");
// });

//CREATE
//Voir authController.js

//UPDATE
router.put('/:id', verifyUser, updateUser);

//DELETE
router.delete('/:id', verifyUser, deleteUser);

//GET
router.get('/:id', verifyUser, getUser);

//GET ALL
router.get('/', verifyAdmin, getAllUsers);

// GET USER BOOKINGS
router.get('/:id/bookings', verifyUser, getUserBookings);
router.get('/:id/flightBookings', verifyUser, getUserFlightBookings);
router.get('/:id/taxiBookings', verifyUser, getUserTaxiBookings);

export default router;
