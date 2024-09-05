import User from '../models/User.js';
import bcrypt from "bcryptjs";

// Create User
export const createUser = async (req, res, next) => {
  const newUser = new User(req.body);
  try{
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
  }catch(err){
      next(err);
  }
}

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

// Delete User
export const deleteUser = async (req, res, next) => {
  try{
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User has been deleted...');
  }catch(err){
      next(err);
  }
}

// Get User
export const getUser = async (req, res, next) => {
  try{
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
  }catch(err){
      next(err);
  }
}

// Get All Users
export const getAllUsers = async (req, res, next) => {
  try{
      const Users = await User.find();
      res.status(200).json(Users);
  }catch(err){
      next(err);
  }
}

// Get User Bookings
export const getUserBookings = async (req, res, next) => {
  try{
      const user = await User.findById(req.params.id).populate('bookings');
      res.status(200).json(user.bookings);
  }catch(err){
      next(err);
  }
}

// Get User Flight Bookings
export const getUserFlightBookings = async (req, res, next) => {
  try{
      const user = await User.findById(req.params.id).populate('flightBookings');
      res.status(200).json(user.flightBookings);
  }catch(err){
      next(err);
  }
}

// Get User Taxi Bookings
export const getUserTaxiBookings = async (req, res, next) => {
  try{
      const user = await User.findById(req.params.id).populate('taxiBookings');
      res.status(200).json(user.taxiBookings);
  }catch(err){
      next(err);
  }
}
