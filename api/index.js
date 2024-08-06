import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import registerRouter from './routes/register.js';
import hotelsRouter from './routes/hotels.js';
import roomsRouter from './routes/rooms.js';
import destinationsRouter from './routes/destinations.js';
import cookieParser from 'cookie-parser';

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

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // verifier si je l'ai déjà ajouté ailleurs

app.use("/api/auth", authRouter);
app.use("/api/register", registerRouter);
app.use("/api/users", usersRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/destinations", destinationsRouter);

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || 'Something went wrong';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: error.stack,
  });
});

app.listen(3000, () => {
  connectToMongo();
  console.log('Express server listening on port "http://localhost:3000"');
});
// Path: backend/routes/auth.js
