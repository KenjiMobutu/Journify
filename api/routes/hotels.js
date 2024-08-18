
import express from 'express';
import Amadeus from 'amadeus';
import { countByCity, countByType, createHotel, deleteHotel, getAllHotels, getHotel, getHotelRooms, updateHotel } from '../controllers/hotelController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

console.log(process.env.API_KEY);
console.log(process.env.API_SECRET);

// Hotel CRUD operations
router.post('/', verifyAdmin, createHotel);
router.put('/:id', verifyAdmin, updateHotel);
router.delete('/:id', verifyAdmin, deleteHotel);
router.get('/find/:id', getHotel);
router.get('/', getAllHotels);
router.get('/countByCity', countByCity);
router.get('/countByType', countByType);
router.get('/room/:id', getHotelRooms);

export default router;
