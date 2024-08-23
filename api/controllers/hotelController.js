import e from 'express';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
const stripe = new Stripe('sk_test_51Ppa9LP9VBJhBODfMnEkzEzH3DmyxzKqPSr71VXvXsHQIAKwnYHsnup6qVFB0bA1ROuS9IzCF1dkWRfWlBBzSa8U00sr19lFAb');


// Create Hotel
export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body);
    try{
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    }catch(err){
        next(err);
    }
}

// Update Hotel
export const updateHotel = async (req, res, next) => {
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(
          req.params.id,
          {$set: req.body},
          {new: true}
        );
        res.status(200).json(updatedHotel);
    }catch(err){
        next(err);
    }
}

// Delete Hotel
export const deleteHotel = async (req, res, next) => {
    try{
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json('Hotel has been deleted...');
    }catch(err){
        next(err);
    }
}

// Get Hotel
export const getHotel = async (req, res, next) => {
    try{
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    }catch(err){
        next(err);
    }
}

// Get All Hotels
export const getAllHotels = async (req, res, next) => {
    const { min, max, limit, ...others } = req.query;

    try {
        // Convertir les valeurs min et max en nombres entiers
        const minPrice = min ? parseInt(min, 10) : 1;
        const maxPrice = max ? parseInt(max, 10) : 9999999;

        // Convertir la limite en nombre entier
        const limitValue = limit ? parseInt(limit, 10) : undefined;

        // Requête Mongoose avec filtres et limite
        //$gte et $lte : Utilisation des opérateurs Mongoose pour définir une plage de prix
        //(greater than or equal pour minPrice et less than or equal pour maxPrice).
        const hotels = await Hotel.find({
            ...others,
            price: { $gte: minPrice, $lte: maxPrice }
        }).limit(limitValue);

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
}


export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");
    try{
        const list = await Promise.all(cities.map(async city => {
            return Hotel.countDocuments({city: city});
        }))
        res.status(200).json(list);
    }catch(err){
        next(err);
    }
}

export const countByType = async (req, res, next) => {
    try{
        const hotelCount = await Hotel.countDocuments({type: "Hotel"});
        const motelCount = await Hotel.countDocuments({type: "Motel"});
        const resortCount = await Hotel.countDocuments({type: "Resort"});
        const guestHouseCount = await Hotel.countDocuments({type: "Guest house"});
        const hostelCount = await Hotel.countDocuments({type: "Hostel"});
        const bnbCount = await Hotel.countDocuments({type: "BnB"});

        res.status(200).json([
            {type: "Hotels", count: hotelCount},
            {type: "Motels", count: motelCount},
            {type: "Resorts", count: resortCount},
            {type: "Guest houses", count: guestHouseCount},
            {type: "Hostels", count: hostelCount},
            {type: "BnB", count: bnbCount}
        ]);
    }catch(err){
        next(err);
    }
}

export const getHotelRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        const listRooms = await Promise.all(hotel.rooms.map((room )=> {
            return Room.findById(room);
        }));
        res.status(200).json(listRooms);
    } catch (error) {
        next(error);
    }
}


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

export const createBooking = async (req, res, next) => {
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
        const newBooking = new Booking({
            ...bookingData,
            paid: true
        });

        const savedBooking = await newBooking.save();
        await User.findByIdAndUpdate(
            {_id: req.body._id},
            {$push: {bookings: savedBooking._id}},
        );

        res.status(200).json(savedBooking);
    }catch(err){
        next(err);
    }
}

export const getBookings = async (req, res, next) => {
    try{
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    }catch(err){
        next(err);
    }
}





