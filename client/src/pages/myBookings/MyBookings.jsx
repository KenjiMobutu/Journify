import "./myBookings.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import axios from 'axios';

const MyBookings = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [taxis, setTaxis] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const { user } = useContext(AuthenticationContext);

  // const { data: hotelData, loading: hotelLoading, error: hotelError } = useFetch(`${apiUrl}/api/users/${user?._id}/bookings`,{
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   },
  //   withCredentials: true,
  // });
  // const { data: flightData, loading: flightLoading, error: flightError } = useFetch(`${apiUrl}/api/users/${user?._id}/flightBookings`,{
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   },
  //   withCredentials: true,
  // });
  // const { data: taxiData, loading: taxiLoading, error: taxiError } = useFetch(`${apiUrl}/api/users/${user?._id}/taxiBookings`,{
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   },
  //   withCredentials: true,
  // });

  const { data: hotelData, loading: hotelLoading, error: hotelError } = useFetch(`/api/users/${user?._id}/bookings`);
  const { data: flightData, loading: flightLoading, error: flightError } = useFetch(`/api/users/${user?._id}/flightBookings`);
  const { data: taxiData, loading: taxiLoading, error: taxiError } = useFetch(`/api/users/${user?._id}/taxiBookings`);
  const { data: attractionData, loading: attractionLoading, error: attractionError } = useFetch(`/api/users/${user?._id}/attractionBookings`);

  useEffect(() => {
    if (hotelData) {
      setBookings(hotelData);
    }
    if (flightData) {
      setFlights(flightData);
    }
    if (taxiData) {
      setTaxis(taxiData);
    }
    if (attractionData) {
      setAttractions(attractionData);
    }
  }, [hotelData, flightData, taxiData, attractionData]);

  console.log("ATTRACTIONS:", attractionData);
  console.log("TAXI:", taxis);

  const handleCancel = async (id, type) => {
    try {
      await axios.delete(`/api/users/${user._id}/bookings/${id}`);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (error) {
      console.error('Error cancelling the booking:', error);
    }
  };

  const isCancelable = (date) => {
    console.log(date);
    const today = new Date();
    const checkDate = new Date(date);
    const differenceInTime = checkDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays >= 3;
  };

  if (hotelLoading || flightLoading || taxiLoading || attractionLoading) return <div>Loading your bookings...</div>;
  if (hotelError) return <div>Error loading hotel bookings: {hotelError.message}</div>;
  if (flightError) return <div>Error loading flight bookings: {flightError.message}</div>;
  if (taxiError) return <div>Error loading taxi bookings: {taxiError.message}</div>;
  if (attractionError) return <div>Error loading attraction bookings: {attractionError.message}</div>;

  return (
    <>
      <Navbar />
      <div className="myBookings">
        <div className="bookings">
          <div className="bookingsTitle">My Bookings</div>
          <div className="bookingsContainer">
            {bookings.length === 0 && flights.length === 0 && attractions.length == 0 && taxis.length == 0 ? (
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
                          {isCancelable(booking.checkIn) && (
                            <button
                              className="cancelButton"
                              onClick={() => handleCancel(booking._id, 'hotel')}
                            >
                              Cancel Booking
                            </button>
                          )}
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
                            <span>{new Date(flight.departureDate).toLocaleString('en-GB', { dateStyle: 'short' })}</span>
                            <span>{new Date(flight.departureDate).toLocaleString('en-GB', { timeStyle: 'short' })}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Arrival</label>
                            <span>{new Date(flight.arrivalDate).toLocaleString('en-GB', { dateStyle: 'short' })}</span>
                            <span>{new Date(flight.arrivalDate).toLocaleString('en-GB', { timeStyle: 'short' })}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Cabin Class</label>
                            <span>{flight.cabinClass}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Total Cost</label>
                            <span>{flight.totalCost} €</span>
                          </div>
                          {isCancelable(flight.departureDate) && (
                            <button
                              className="cancelButton"
                              onClick={() => handleCancel(flight._id, 'flight')}
                            >
                              Cancel Flight
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* TAXI BOOKINGS */}
                {taxis.length > 0 && (
                  <div className="taxiBookings">
                    <h2>Taxi Bookings</h2>
                    {taxis.map((taxi, index) => (
                      <div className="booking" key={index}>
                        <div className="bookingTitle">Taxi to {taxi.arrival}</div>
                        <div className="bookingDetails">
                          <div className="bookingDetail">
                            <label>From</label>
                            <span>{taxi.departure} </span>
                          </div>
                          <div className="bookingDetail">
                            <label>To</label>
                            <span>{taxi.arrival}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Departure</label>
                            <span>{new Date(taxi.date).toLocaleString('en-GB', { dateStyle: 'short' })}</span>
                            <span>{taxi.time}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Distance</label>
                            <span>{taxi.distance} km</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Total Cost</label>
                            <span>{taxi.price} €</span>
                          </div>
                          {isCancelable(taxi.time) && (
                            <button
                              className="cancelButton"
                              onClick={() => handleCancel(taxi._id, 'taxi')}
                            >
                              Cancel Ride
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ATTRACTION BOOKINGS */}
                {attractions.length > 0 && (
                  <div className="attractionBookings">
                    <h2>Attraction Bookings</h2>
                    {attractions.map((attraction, index) => (
                      <div className="booking" key={index}>
                        <div className="bookingTitle">{attraction.name}</div>
                        <div className="bookingDetails">
                          {/* <div className="bookingDetail">
                            <label>Location</label>
                            <span>{attraction.city}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Start Date</label>
                            <span>{new Date(attraction.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="bookingDetail">
                            <label>End Date</label>
                            <span>{new Date(attraction.endDate).toLocaleDateString()}</span>
                          </div> */}
                          <div className="bookingDetail">
                            <label>Price</label>
                            <span>{attraction.price} €</span>
                          </div>
                          <div className="bookingDetail">
                            <label>Ticket(s)</label>
                            <span>{attraction.ticketCount}</span>
                          </div>
                          {isCancelable(attraction.startDate) && (
                            <button
                              className="cancelButton"
                              onClick={() => handleCancel(attraction._id, 'attraction')}
                            >
                              Cancel Booking
                            </button>
                          )}
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
