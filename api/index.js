import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import registerRouter from "./routes/register.js";
import hotelsRouter from "./routes/hotels.js";
import roomsRouter from "./routes/rooms.js";
import destinationsRouter from "./routes/destinations.js";
import paymentRouter from "./routes/payment.js";
import chatRouter from "./routes/chat.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Group from "./models/Group.js";

const app = express();

dotenv.config();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8000", "http://localhost:5000"],
    methods: ["GET", "POST"],
  },
});

// const io = new Server(httpServer, {
//   cors: {
//     origin: ["https://journify-9zve.onrender.com", "http://localhost:8000"], // Assurez-vous que les origines sont correctes
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!!!");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!!!");
});

connectToMongo();

// Middlewares
app.use(cors()); // Autorise toutes les origines

// Ou pour une origine spécifique :
app.use(
  cors({
    origin: "http://localhost:5000", // Adresse de l'application cliente
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
    credentials: true,
  })
);

// app.options(
//   "*",
//   cors({
//     origin: "https://journify-9zve.onrender.com",
//     credentials: true,
//   })
// );

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // verifier si je l'ai déjà ajouté ailleurs

app.use("/api/auth", authRouter);
app.use("/api/register", registerRouter);
app.use("/api/users", usersRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/destinations", destinationsRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/chat", chatRouter);

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: error.stack,
  });
});

const users = {}; // Un objet pour stocker les utilisateurs et leurs socket.id

// Gestion des connexions socket.io
io.on("connection", (socket) => {
  console.log("A user connected!", socket.id);

  // Lorsqu'un nouvel utilisateur se connecte
  socket.on("loginUser", (userId, userName) => {
    // Associer le socket.id à l'utilisateur
    users[userId] = socket.id;
    socket.join(userId);
    console.log(`User logged: ${userName} ${userId} with socket ID ${socket.id}`);

    for (let username in users) {
      console.log(`User logged: ${username} with socket ID ${socket.id}`);
    }
  });

  // Pour envoyer une notification à un utilisateur spécifique
  socket.on("sendNotificationToUser", ({ targetUsername, message }) => {
    const targetSocketId = users[targetUsername];
    if (targetSocketId) {
      socket.to(targetSocketId).emit("notification", message); // Envoi uniquement à l'utilisateur ciblé
      console.log(`Notification sent to ${targetUsername}: ${message}`);
    } else {
      console.log(`User ${targetUsername} not found or not connected.`);
    }
  });

  // Lorsqu'un nouvel utilisateur s'inscrit
  socket.on("notificationRegister", (username) => {
    io.emit("notification", `New user registered: ${username}`);
  });

  // Lorsqu'un utilisateur existant met à jour ses informations
  socket.on("notificationUpdate", (username) => {
    console.log("User updated:", username);
    io.emit("notification", `User updated: ${username}`);
  });

  // Lorsqu'une nouvelle réservation est effectuée
  socket.on("notificationBooking", (message) => {
    io.emit("notification", message);
  });

  socket.on("notificationFlightBooking", (message) => {
    io.emit("notification", message);
  });

  socket.on("notificationTaxiBooking", (message) => {
    io.emit("notification", message);
  });

  socket.on("notificationAttractionBooking", (message) => {
    io.emit("notification", message);
  });

  // Gestion de l'événement 'joinChat'
  socket.on("joinChat", ({ chatId, userId }) => {
    // Joindre l'utilisateur à la "room" du chatId
    socket.join(chatId);
    console.log(`User with ID ${userId} joined chat room ${chatId}`);

    // Informer les autres utilisateurs dans la "room"
    socket.to(chatId).emit("userJoined", {
      userId,
      message: `User ${userId} has joined the chat.`,
    });
  });

  // Gestion des messages envoyés à une "room"
  socket.on("message", ({ chatId, message, userId }) => {
    // Émettre le message à tous les utilisateurs dans la "room"
    io.to(chatId).emit("newMessage", { userId, message });
  });

  // Écouter l'événement d'envoi de message
  socket.on("sendMessage", async (messageData) => {
    console.log("Message received:", messageData);
    const { chatId, senderId, receiverId, content, isGroup } = messageData;

    // Envoyer le message à la "room" du chat
    io.to(chatId).emit("receiveMessage", messageData);

    // Si c'est un message de groupe, envoyer aux membres du groupe
    if (isGroup) {
      const group = await Group.findById(chatId).populate("members"); // Assurez-vous que le groupe est peuplé avec les membres
      // Envoyer une notification à chaque membre du groupe, sauf l'expéditeur
      group.members.forEach((member) => {
        if (member._id.toString() !== senderId) {
          const targetSocketId = users[member._id.toString()];
          if (targetSocketId) {
            io.to(targetSocketId).emit("notification", {
              senderId,
              content: `Nouveau message dans le groupe ${group.groupName}`,
            });
          }
        }
      });
    } else {
      // Si c'est un message privé, notifier l'ami directement
      if (receiverId !== senderId) {
        const targetSocketId = users[receiverId];
        if (targetSocketId) {
          io.to(targetSocketId).emit("notification", {
            senderId,
            content: `Nouveau message de ${senderId}`,
          });
        }
      }
    }

    // Envoyer le message à l'utilisateur ou au groupe
    io.to(chatId).emit("receiveMessage", messageData);
  });

  // Gestion de la déconnexion
  socket.on("disconnect", () => {
    console.log(`User with socketId ${socket.id} disconnected.`);
    // Supprimer l'utilisateur de la liste des connectés
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

// Écoute du serveur sur le port 3000
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log('Express server listening on port "http://localhost:3000"');
});
