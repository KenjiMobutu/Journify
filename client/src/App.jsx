import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Index from './pages/Index';
import Login from './pages/login/Login';
import List from './pages/list/List';
import Hotel from './pages/hotel/Hotel';
import Register from "./pages/register/Register";
import Booking from "./pages/booking/Booking";
import MyBookings from "./pages/myBookings/MyBookings";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Profile from "./pages/profile/Profile";
import Attractions from "./pages/attractions/Attractions";
import CarRental from "./pages/carRental/CarRental";
import Flights from "./pages/flights/Flights";
import Taxi from "./pages/taxi/Taxi";
import FlightBooking from "./pages/flightBooking/FlightBooking";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register socket={socket} />} />
        <Route path="/register/:id" element={<Register socket={socket} />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/hotels/:id/booking" element={<Booking socket={socket} />} />
        <Route path="/myBookings" element={<MyBookings />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/attractions" element={<Attractions />} />
        <Route path="/car" element={<CarRental />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/booking" element={<FlightBooking socket={socket} />} />
        <Route path="/payment" />
        <Route path="/taxi" element={<Taxi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
