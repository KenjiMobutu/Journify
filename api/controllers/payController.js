import Stripe from 'stripe';
import FlightBooking from '../models/FlightBooking.js';
import User from '../models/User.js';
import Taxi from '../models/Taxi.js';
import Attraction from '../models/Attraction.js';


const stripe = new Stripe('sk_test_51Ppa9LP9VBJhBODfMnEkzEzH3DmyxzKqPSr71VXvXsHQIAKwnYHsnup6qVFB0bA1ROuS9IzCF1dkWRfWlBBzSa8U00sr19lFAb');

// Créer un paiement
export const createPaymentIntent = async (req, res) => {
  try {
      const paymentIntent = await stripe.paymentIntents.create({
          amount: req.body.amount, // Montant à facturer en centimes
          currency: 'eur', // Devise utilisée
          payment_method_types: ['card'], // Méthodes de paiement acceptées
      });
      //console.log("Payment Intent : ", paymentIntent);
      res.status(200).json({
          clientSecret: paymentIntent.client_secret,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


//FLIGHTS
// CREATE a new flight booking
export const createFlightBooking = async (req, res, next) => {
  try{
      const paymentIntentId = req.body.paymentIntentId;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if(paymentIntent.status !== 'succeeded'){
          return res.status(400).json({message: 'Payment not successful. Status: ' + paymentIntent.status});
      }

      // Filtrer l'ID pour éviter la duplication
      const bookingData = { ...req.body };
      delete bookingData._id;

      // Création de la nouvelle réservation avec paid à true
      const newBooking = new FlightBooking({
          ...bookingData,
          paid: true
      });

      const savedBooking = await newBooking.save();
      await User.findByIdAndUpdate(
          {_id: req.body._id},
          {$push: {flightBookings: savedBooking._id}},
      );

      res.status(200).json(savedBooking);
  }catch(err){
      next(err);
  }
}

//GET all flight bookings
export const getFlightBookings = async (req, res, next) => {
    try{
        const bookings = await FlightBooking.find();
        res.status(200).json(bookings);
    }catch(err){
        next(err);
    }
}

//DELETE a flight booking
export const deleteFlightBooking = async (req, res, next) => {
    try{
        const booking = await FlightBooking.findByIdAndDelete(req.params.id);
        if(!booking){
            return res.status(404).json({message: 'Booking not found'});
        }
        res.status(200).json(booking);
    }catch(err){
        next(err);
    }
}




//TAXIS

// Créer une réservation de taxi
export const createTaxiBooking = async (req, res, next) => {
    try{
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if(paymentIntent.status !== 'succeeded'){
            return res.status(400).json({message: 'Payment not successful. Status: ' + paymentIntent.status});
        }

        // Filtrer l'ID pour éviter la duplication
        const bookingData = { ...req.body };
        delete bookingData._id;

        // Création de la nouvelle réservation avec paid à true
        const newBooking = new Taxi({
            ...bookingData,
            paid: true
        });

        const savedBooking = await newBooking.save();
        await User.findByIdAndUpdate(
            {_id: req.body._id},
            {$push: {taxiBookings: savedBooking._id}},
        );

        res.status(200).json(savedBooking);
    }catch(err){
        next(err);
    }
}

//GET all taxi bookings
export const getTaxiBookings = async (req, res, next) => {
    try{
        const bookings = await Taxi.find();
        res.status(200).json(bookings);
    }catch(err){
        next(err);
    }
}

//DELETE a taxi booking
export const deleteTaxiBooking = async (req, res, next) => {
    try{
        const booking = await Taxi.findByIdAndDelete(req.params.id);
        if(!booking){
            return res.status(404).json({message: 'Booking not found'});
        }
        res.status(200).json(booking);
    }catch(err){
        next(err);
    }
}


//ATTRACTIONS
// CREATE a new attraction booking
export const createAttractionBooking = async (req, res, next) => {
    try{
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if(paymentIntent.status !== 'succeeded'){
            return res.status(400).json({message: 'Payment not successful. Status: ' + paymentIntent.status});
        }

        // Filtrer l'ID pour éviter la duplication
        const bookingData = { ...req.body };
        delete bookingData._id;

        // Création de la nouvelle réservation avec paid à true
        const newBooking = new Attraction({
            ...bookingData,
            paid: true
        });

        const savedBooking = await newBooking.save();
        await User.findByIdAndUpdate(
            {_id: req.body._id},
            {$push: {attractionBookings: savedBooking._id}},
        );

        res.status(200).json(savedBooking);
    }catch(err){
        next(err);
    }
}
