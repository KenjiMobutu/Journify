import express from 'express';
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';
import { createFlightBooking, createPaymentIntent, getFlightBookings } from '../controllers/payController.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Payment Stripe
router.post("/create-payment-intent", verifyToken, createPaymentIntent)
router.post("/bookings", verifyToken, createFlightBooking)

//GET all flight bookings
router.get("/bookings", verifyAdmin, getFlightBookings);

export default router;
