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
import TaxiBooking from "./pages/taxiBooking/TaxiBooking";
import AttractionBooking from "./pages/attractionBooking/AttractionBooking";
import Cart from "./pages/cart/Cart";
import Friend from "./pages/friend/Friend";
import { useContext } from "react";
import { AuthenticationContext } from "./context/AuthenticationContext";


function App() {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthenticationContext);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index socket={socket} />} />
        <Route path="/login" element={<Login socket={socket} />} />
        <Route path="/register" element={<Register socket={socket} />} />
        <Route path="/register/:id" element={<Register socket={socket} />} />
        <Route path="/hotels" element={<List socket={socket}/>} />
        <Route path="/hotels/:id" element={<Hotel socket={socket}/>} />
        <Route path="/hotel" element={<Hotel socket={socket}/>} />
        <Route path="/hotels/:id/booking" element={<Booking socket={socket} />} />
        <Route path="/myBookings" element={<MyBookings socket={socket}/>} />
        <Route path="/profile/:id" element={<Profile socket={socket}/>} />
        <Route path="/attractions" element={<Attractions socket={socket}/>} />
        <Route path="/attractions/booking" element={<AttractionBooking socket={socket} />} />
        <Route path="/car" element={<CarRental socket={socket}/>} />
        <Route path="/flights" element={<Flights socket={socket}/>} />
        <Route path="/flights/booking" element={<FlightBooking socket={socket} />} />
        <Route path="/payment" />
        <Route path="/taxi" element={<Taxi socket={socket}/>} />
        <Route path="/taxi/booking" element={<TaxiBooking socket={socket} />} />
        <Route path="/cart" element={<Cart socket={socket} />} />
        <Route path="/friends" element={<Friend socket={socket} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
