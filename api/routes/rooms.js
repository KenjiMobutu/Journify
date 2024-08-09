import express from 'express';
import Room from '../models/Room.js';
import { createRoom, deleteRoom, getAllRooms, getRoom, updateAvailabilityRoom, updateRoom } from '../controllers/roomController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

//CREATE
router.post('/:hotelId', verifyAdmin, createRoom);

//UPDATE
router.put('/:id', verifyAdmin, updateRoom);
router.put('/availability/:id', updateAvailabilityRoom);

//DELETE
router.delete('/:id/:hotelId', verifyAdmin, deleteRoom);

//GET
router.get('/:id', getRoom);

//GET ALL
router.get('/', getAllRooms);


export default router;
