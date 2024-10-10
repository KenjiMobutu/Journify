import express from 'express';
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';
import { createFlightBooking,
        createPaymentIntent,
        getFlightBookings,
        deleteFlightBooking,
        updateFlightBooking,
        createTaxiBooking,
        getTaxiBookings,
        deleteTaxiBooking,
        createAttractionBooking,
        getAttractionBookings,
        deleteAttractionBooking,
        updateAttractionBooking
      } from '../controllers/payController.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Payment Stripe
router.post("/create-payment-intent", verifyToken, createPaymentIntent)


//FLIGHTS
// Create a new flight booking
router.post("/bookings", verifyToken, createFlightBooking)

//GET all flight bookings
router.get("/bookings", verifyAdmin, getFlightBookings);

//Delete a flight booking
router.delete("/bookings/:id", verifyAdmin, deleteFlightBooking);

//update a flight booking
router.put("/bookings/:id", verifyAdmin, updateFlightBooking);


//TAXIS
// Create a new taxi booking
router.post("/taxi", verifyToken, createTaxiBooking)

//GET all taxi bookings
router.get("/taxi", verifyAdmin, getTaxiBookings);

//Delete a taxi booking
router.delete("/taxi/:id", verifyAdmin, deleteTaxiBooking);


//ATTRACTIONS
// Create a new attraction booking
router.post("/attraction", verifyToken, createAttractionBooking)

//GET all attraction bookings
router.get("/attraction", verifyAdmin, getAttractionBookings);

//Delete an attraction booking
router.delete("/attraction/:id", verifyAdmin, deleteAttractionBooking);

//update an attraction booking
router.put("/attraction/:id", verifyAdmin, updateAttractionBooking);

export default router;
