import "./myBookings.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthenticationContext);

  const { data, loading, error } = useFetch(`/api/users/${user?._id}/bookings`);

  useEffect(() => {
    if (data) {
      setBookings(data);
    }
  }, [data]);

  if (loading) return <div>Loading your bookings...</div>;
  if (error) return <div>Error loading bookings: {error.message}</div>;

  return (
    <div className="bookings">
      <div className="bookingsTitle">My Bookings</div>
      <div className="bookingsContainer">
        {bookings.length === 0 ? (
          <div>You have no bookings yet.</div>
        ) : (
          bookings.map((booking, index) => (
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
          ))
        )}
      </div>
      <Link to="/">
        <button className="homeButton"> Home</button>
      </Link>
    </div>
  );
};

export default MyBookings;
