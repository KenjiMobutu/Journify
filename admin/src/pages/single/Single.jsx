import './single.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import useFetch from '../../hooks/useFetch'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const Single = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[2];
  const { data } = useFetch(`/api/users/${path}`);

  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [taxis, setTaxis] = useState([]);
  console.log("TAXI:", taxis);
  console.log("FLIGHTS:", flights);
  console.log("BOOKINGS:", bookings);

  const { data: hotelData, loading: hotelLoading, error: hotelError } = useFetch(`/api/users/${path}/bookings`);
  const { data: flightData, loading: flightLoading, error: flightError } = useFetch(`/api/users/${path}/flightBookings`);
  const { data: taxiData, loading: taxiLoading, error: taxiError } = useFetch(`/api/users/${path}/taxiBookings`);

  const handleEdit = () => {
    navigate(`/users/new/${path}`);
  };

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
  }, [hotelData, flightData, taxiData]);

  if (!data) {
    return <div>Loading...</div>;
  }

  if (hotelLoading || flightLoading || taxiLoading) return <div>Loading your bookings...</div>;
  if (hotelError) return <div>Error loading hotel bookings: {hotelError.message}</div>;
  if (flightError) return <div>Error loading flight bookings: {flightError.message}</div>;
  if (taxiError) return <div>Error loading taxi bookings: {taxiError.message}</div>;

  const handleCancelBooking = async (bookingId) => {
    try {
      // Faire une requête pour annuler la réservation
      await axios.delete(`/api/bookings/${bookingId}`);
      // Mettre à jour l'état des réservations
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error("Failed to cancel booking", error);
    }
  };

  const handleCancelFlight = async (flightId) => {
    try {
      // Faire une requête pour annuler la réservation de vol
      await axios.delete(`/api/flights/${flightId}`);
      // Mettre à jour l'état des réservations de vol
      setFlights(prev => prev.filter(flight => flight.id !== flightId));
    } catch (error) {
      console.error("Failed to cancel flight booking", error);
    }
  };


  return (
    <div className='single'>
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleEdit}>Edit</div>
            <h1 className="title">Informations</h1>
            <div className="item">
              <img src={data.img || "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">
                  {data.userName || "John Doe"}
                </h1>
                <div className="detailItem">
                  <span className="detailKey">ID:</span>
                  <span className="detailValue">{data._id}</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Email:</span>
                  <span className="detailValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Status:</span>
                  <span className="detailValue">{data.isAdmin ? "Admin" : "User"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="bottomBookings">
            <h1 className="title">Bookings</h1>
            <div className="bottomBookingsContainer">
              <div className="bookingsContainer">
                {bookings.length === 0 && flights.length === 0 && taxis.length === 0 ? (
                  <div>Have no bookings yet.</div>
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
                              <div className="bookingDetail">
                                <button className="cancelButton" onClick={() => handleCancelBooking(booking.id)}>
                                  Cancel Booking
                                </button>
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
                                <span>{flight.departureAirport}</span>
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
                              <div className="bookingDetail">
                                <button className="cancelButton" onClick={() => handleCancelFlight(flight.id)}>
                                  Cancel Booking
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Taxi Bookings */}
                    {taxis.length > 0 && (
                      <div className="taxiBookings">
                        <h2>Taxi Bookings</h2>
                        {taxis.map((taxi, index) => (
                          <div className="booking" key={index}>
                            <div className="bookingTitle">Taxi to {taxi.arrival}</div>
                            <div className="bookingDetails">
                              <div className="bookingDetail">
                                <label>From</label>
                                <span>{taxi.departure}</span>
                              </div>
                              <div className="bookingDetail">
                                <label>To</label>
                                <span>{taxi.arrival}</span>
                              </div>
                              <div className="bookingDetail">
                                <label>Date</label>
                                <span>{new Date(taxi.date).toLocaleDateString()}</span>
                                <span>{taxi.time}</span>
                              </div>
                              <div className="bookingDetail">
                                <label>Distance</label>
                                <span>{taxi.distance} km</span>
                              </div>
                              <div className="bookingDetail">
                                <label>Type</label>
                                <span>{taxi.type}</span>
                              </div>
                              <div className="bookingDetail">
                                <label>Description</label>
                                <span>{taxi.description}</span>
                              </div>
                              <div className="bookingDetail">
                                <label>Price</label>
                                <span>{taxi.price} €</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Single;
