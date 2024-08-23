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
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

dotenv.config();

const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:8000",
//   }
// });
const io = new Server(httpServer, {
  cors: {
    cors: { origin: "*" }
    // origin: (origin, callback) => {
    //   const allowedOrigins = ["http://localhost:8000", "http://localhost:5000"];
    //   if (allowedOrigins.includes(origin)) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error("Not allowed by CORS"));
    //   }
    // },
    // methods: ["GET", "POST", "PUT", "DELETE"],
  }
});


const connectToMongo = async() =>{
  try {
    await mongoose.connect(process.env.MONGO);
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

connectToMongo();

// Middlewares
app.use(cors()); // Autorise toutes les origines

// Ou pour une origine spécifique :
app.use(cors({
  origin: 'http://localhost:5000'
}));

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

// Gestion des connexions socket.io
io.on("connection", (socket) => {
  console.log("A user connected!", socket.id);

  // Lorsqu'un nouvel utilisateur s'inscrit
  socket.on("notificationRegister", (username) => {
    //console.log(`${username} registered.`);
    // Envoyer une notification à tous les utilisateurs connectés
    io.emit("notification", `New user registered : ${username} .`);
  });

  // Lorsqu'une nouvelle réservation est effectuée
  socket.on("notificationBooking", (message) => {
    console.log("New booking:", message);
    // Envoyer une notification à tous les utilisateurs connectés
    io.emit("notification", `${message}`);
  });

  // Gestion de la déconnexion
  socket.on('disconnect', () => {
    console.log(`User with socketId ${socket.id} disconnected.`);
  });
});


// Écoute du serveur sur le port 3000
httpServer.listen(3000, () => {
  console.log('Express server listening on port "http://localhost:3000"');
});

// app.listen(3000, () => {
//   connectToMongo();
//   console.log('Express server listening on port "http://localhost:3000"');
// });
