import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import registerRouter from './routes/register.js';
import hotelsRouter from './routes/hotels.js';
import roomsRouter from './routes/rooms.js';
import destinationsRouter from './routes/destinations.js';

const app = express();
dotenv.config();

const connectToMongo = async() =>{
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected!!!');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!!!');
});

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/register", registerRouter);
app.use("/api/users", usersRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/destinations", destinationsRouter);

app.listen(3000, () => {
  connectToMongo();
  console.log('Express server listening on port "http://localhost:3000"');
});
// Path: backend/routes/auth.js
