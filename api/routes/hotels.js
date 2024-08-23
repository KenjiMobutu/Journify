import express from 'express';
import { countByCity,
        countByType,
        createHotel,
        deleteHotel,
        getAllHotels,
        getHotel,
        getHotelRooms,
        createBooking,
        getBookings,
        createPaymentIntent,
        updateHotel } from '../controllers/hotelController.js';
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

// Booking
router.post("/:id/bookings", verifyToken, createBooking);
router.get("/bookings", verifyAdmin, getBookings);

// Payment Stripe
router.post("/create-payment-intent", verifyToken, createPaymentIntent)


export default router;
