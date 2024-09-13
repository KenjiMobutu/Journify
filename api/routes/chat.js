import express from 'express';
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';
import { postChat, getChat } from '../controllers/chatController.js';

const router = express.Router();

router.post("", verifyToken, postChat);

router.get("/userChat/:id", verifyToken, getChat);


export default router;
