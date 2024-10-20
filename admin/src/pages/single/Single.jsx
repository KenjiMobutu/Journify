import './single.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Single = ({ socket }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[2];

  const [data, setData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [taxis, setTaxis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${backendUrl}/api/users/${path}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          withCredentials: true,
        });
        setData(userResponse.data);

        const hotelResponse = await axios.get(`${backendUrl}/api/users/${path}/bookings`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          withCredentials: true,
        });
        setBookings(hotelResponse.data);

        const flightResponse = await axios.get(`${backendUrl}/api/users/${path}/flightBookings`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          withCredentials: true,
        });
        setFlights(flightResponse.data);

        const taxiResponse = await axios.get(`${backendUrl}/api/users/${path}/taxiBookings`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          withCredentials: true,
        });
        setTaxis(taxiResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl, path]);

  const handleEdit = () => {
    navigate(`/users/new/${path}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleDeleteBooking = async (bookingId) => {
    confirmAlert({
      title: 'Confirm deletion',
      message: 'Do you really want to delete this booking?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`${backendUrl}/api/users/${data._id}/bookings/${bookingId}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                withCredentials: true,
              });
              setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
            } catch (error) {
              console.error("Failed to cancel booking", error);
            }
          },
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  const handleCancelBooking = async (id) => {
    confirmAlert({
      title: 'Confirm cancellation',
      message: 'Do you really want to cancel your booking?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.put(`${backendUrl}/api/users/${data._id}/bookings/${id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                withCredentials: true,
              });
              setBookings((prev) => prev.filter((booking) => booking._id !== id));
              socket?.emit("cancelBooking", { userId: data._id, bookingId: id });
            } catch (error) {
              console.error('Error cancelling the booking:', error);
            }
          },
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  const handleCancelFlight = async (flightId) => {
    confirmAlert({
      title: 'Confirm cancellation',
      message: 'Do you really want to cancel your flight booking?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.put(`${backendUrl}/api/payment/bookings/${flightId}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                withCredentials: true,
              });
              setFlights((prev) => prev.filter((flight) => flight._id !== flightId));
            } catch (error) {
              console.error('Error cancelling the flight:', error);
            }
          },
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  const handleTaxiCancel = async (taxiId) => {
    confirmAlert({
      title: 'Confirm cancellation',
      message: 'Do you really want to cancel your taxi booking?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.put(`${backendUrl}/api/taxis/${taxiId}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                withCredentials: true,
              });
              setTaxis((prev) => prev.filter((taxi) => taxi._id !== taxiId));
            } catch (error) {
              console.error('Error cancelling the taxi:', error);
            }
          },
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });

  const isCancelable = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    const differenceInTime = checkDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays >= 3;
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
              <img src={data.img || "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg"} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{data.userName || "John Doe"}</h1>
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
                  <div>No bookings yet.</div>
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
                                <label>Total Cost</label>
                                <span>{booking.totalCost} €</span>
                              </div>
                              <div className="adminButtons">
                                <div className="bookingDetail">
                                  {isCancelable(booking.checkIn) && (
                                    <button className="cancelButton" onClick={() => handleCancelBooking(booking._id)}>
                                      Cancel Booking
                                    </button>
                                  )}
                                </div>
                                <div className="bookingDetail">
                                  <button className="deleteButton" onClick={() => handleDeleteBooking(booking._id)}>
                                    Delete Booking
                                  </button>
                                </div>
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
                                <label>Cabin Class</label>
                                <span>{flight.cabinClass}</span>
                              </div>
                              <div className="bookingDetail">
                                <label>Total Cost</label>
                                <span>{flight.totalCost} €</span>
                              </div>
                              <div className="adminButtons">
                                <div className="bookingDetail">
                                  {isCancelable(flight.departureDate) && (
                                    <button className="cancelButton" onClick={() => handleCancelFlight(flight._id)}>
                                      Cancel Booking
                                    </button>
                                  )}
                                </div>
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
                              <div className="adminButtons">
                                <div className="bookingDetail">
                                  {isCancelable(taxi.date) && (
                                    <button className="cancelButton" onClick={() => handleTaxiCancel(taxi._id)}>
                                      Cancel Ride
                                    </button>
                                  )}
                                </div>
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
  );
};
}

export default Single;
