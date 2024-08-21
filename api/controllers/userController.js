import User from '../models/User.js';

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
  try{
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true}
      );
      res.status(200).json(updatedUser);
  }catch(err){
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
