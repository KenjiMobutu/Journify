import "./myBookings.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const { user } = useContext(AuthenticationContext);

  const { data: hotelData, loading: hotelLoading, error: hotelError } = useFetch(`/api/users/${user?._id}/bookings`);
  const { data: flightData, loading: flightLoading, error: flightError } = useFetch(`/api/users/${user?._id}/flightBookings`);

  useEffect(() => {
    if (hotelData) {
      setBookings(hotelData);
    }
    if (flightData) {
      setFlights(flightData);
    }
  }, [hotelData, flightData]);

  if (hotelLoading || flightLoading) return <div>Loading your bookings...</div>;
  if (hotelError) return <div>Error loading hotel bookings: {hotelError.message}</div>;
  if (flightError) return <div>Error loading flight bookings: {flightError.message}</div>;

  return (
    <>
      <Navbar />
      <div className="myBookings">

        <div className="bookings">
          <div className="bookingsTitle">My Bookings</div>

          <div className="bookingsContainer">
            {bookings.length === 0 && flights.length === 0 ? (
              <div>You have no bookings yet.</div>
            ) : (
              <>
                {/* Hotel Bookings */}
                {bookings.length > 0 && (
                  <div className="hotelBookings">
                    <h2>Hotel Bookings</h2>
                    {bookings.map((booking, index) => (
                      <div className="booking" key={index}>
                        <div className="bookingTitle">{booking.hotelName}</div>
                        <div className="bookingDetails">
                          <div className="bookingDetail">
                            <label>Location</label>
                            <span>{booking.address} {booking.country}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Check-in</label>
                            <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Check-out</label>
                            <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Number of Nights</label>
                            <span>{booking.numberOfNights}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Number of Rooms</label>
                            <span>{booking.rooms}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Number of Guests</label>
                            <span>{booking.adultsCount + booking.childrenCount}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Total Cost</label>
                            <span>{booking.totalCost} €</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Flight Bookings */}
                {flights.length > 0 && (
                  <div className="flightBookings">
                    <h2>Flight Bookings</h2>
                    {flights.map((flight, index) => (
                      <div className="booking" key={index}>
                        <div className="bookingTitle">Flight to {flight.arrivalAirport}</div>
                        <div className="bookingDetails">
                          <div className="bookingDetail">
                            <label>From</label>
                            <span>{flight.departureAirport} </span>
                          </div>
                          <div className="bookingDetail">
                            <label>To</label>
                            <span>{flight.arrivalAirport}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Departure</label>
                            <span>{new Date(flight.departureDate).toLocaleDateString()}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Arrival</label>
                            <span>{new Date(flight.arrivalDate).toLocaleDateString()}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Cabin Class</label>
                            <span>{flight.cabinClass}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Total Cost</label>
                            <span>{flight.totalCost} €</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <Link to="/">
            <button className="homeButton"> Home</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MyBookings;
