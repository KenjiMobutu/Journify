import express from 'express';
import { updateUser, deleteUser, getUser, getAllUsers } from '../controllers/userController.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

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

//UPDATE
router.put('/:id', verifyUser, updateUser);

//DELETE
router.delete('/:id', verifyUser, deleteUser);

//GET
router.get('/:id', verifyUser, getUser);

//GET ALL
router.get('/', verifyAdmin, getAllUsers);

export default router;
