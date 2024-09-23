import "./booking.css";
import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import { format } from "date-fns";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';


const Booking = ({ socket }) => {
  const token = localStorage.getItem('access_token');
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const { startDate, endDate, adults, children, rooms, hotel, price, addedAttractions, attractionPrice, selectedFlight } = location.state || {};
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('Payer');
  const { user } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  console.log(location.state);
  console.log("FLIGHT", selectedFlight);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Calculate validated prices
  const validatedPrice = Number(price) || 0;
  const validatedAttractionPrice = Math.round(Number(attractionPrice)) || 0;

  const formattedStartDate = format(new Date(startDate), "dd/MM/yyyy");
  const formattedEndDate = format(new Date(endDate), "dd/MM/yyyy");

  const numberOfNights = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      setButtonDisabled(true);

      // Fetch payment intent
      const paymentIntentRes = await fetch(`/api/hotels/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: validatedAttractionPrice * 100 })
      });

      if (!paymentIntentRes.ok) {
        throw new Error(`Failed to create payment intent: ${paymentIntentRes.statusText}`);
      }

      const paymentIntentData = await paymentIntentRes.json();
      if (!paymentIntentData.clientSecret) {
        throw new Error("Failed to retrieve client secret from payment intent response.");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.userName,
            email: user.email,
          },
        },
      });

      if (error) {
        throw new Error(`Payment error: ${error.message}`);
      }

      // Set payment intent id on success
      setPaymentIntentId(paymentIntent.id);

      // Send booking details after payment success
      const bookingResponse = await fetch(`/api/hotels/${hotel.hotel_id}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          _id: user._id,
          userName: user.userName,
          userEmail: user.email,
          hotelName: hotel.hotel_name,
          checkIn: startDate,
          checkOut: endDate,
          adultsCount: adults,
          childrenCount: children,
          rooms,
          hotel: hotel._id,
          totalCost: price,
          numberOfNights: Math.round(numberOfNights),
          address: hotel.address,
          zip: hotel.zip || '',
          city: hotel.city_trans,
          country: hotel.country_trans,
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error(`Failed to book: ${bookingResponse.statusText}`);
      }

      await bookingResponse.json();

      // Handle payment for attractions and flights
      await handleExtraPayments(paymentIntent.id, token, user, addedAttractions, selectedFlight);

      // Payment success actions
      setPaymentSuccess(true);
      setButtonText('Paid');
      setShowConfirmation(true);
      socket?.emit("notificationBooking", `${user.userName} made a new booking.`);

      setTimeout(() => setShowConfirmation(false), 5000);
    } catch (err) {
      console.error(err.message);
    } finally {
      setButtonDisabled(false);
    }
  };

  // Handle payment for attractions and flights
  const handleExtraPayments = async (paymentIntentId, token, user, addedAttractions, selectedFlight) => {
    try {
      for (const attraction of addedAttractions) {
        const attractionResponse = await fetch(`/api/payment/attraction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentIntentId,
            _id: user._id,
            userName: user.userName,
            userEmail: user.email,
            ...attraction,
          }),
        });
        if (!attractionResponse.ok) throw new Error('Payment failed for attraction');
      }

      for (const flight of selectedFlight) {
        const flightResponse = await fetch(`/api/payment/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentIntentId,
            _id: user._id,
            userName: user.userName,
            userEmail: user.email,
            departureAirport: flight.segments[0].departureAirport.cityName,
            arrivalAirport: flight.segments[0].arrivalAirport.cityName,
            departureDate: flight.segments[0].departureTime,
            arrivalDate: flight.segments[0].arrivalTime,
            adultsCount: adults,
            childrenCount: children,
            cabinClass: flight.segments[0].legs[0].cabinClass,
            totalCost: flight.priceBreakdown.total.units,
          }),
        });
        if (!flightResponse.ok) throw new Error('Payment failed for flight');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <Navbar socket={socket}/>
      {user ? (
        <div className="bookingContainer">
          <div className="detailsB">
            <div className="detailsTitle">Your Booking Details</div>
            <div className="detailsItem">
              <div className="location">
                <div className="locationLabel">
                  <label>Location</label>
                </div>
                <div className="locationName">
                  <span>{hotel.hotel_name}</span>
                </div>
                <div className="locationAddress">
                  <span>{hotel.address}, {hotel.zip} {hotel.city_trans}, {hotel.country_trans}</span>
                </div>
              </div>
              <br></br>
              <div className="dates">
                <div className="datesItem">
                  <div className="checkIn">
                    <label>Check-in</label>
                    <span>{formattedStartDate}</span>
                  </div>
                  <div className="checkOut">
                    <label>Check-out</label>
                    <span>{formattedEndDate}</span>
                  </div>
                </div>
              </div>
              <br></br>
              <div className="numberNights">
                <div className="numberNightsLabel">
                  <label>Number of Nights</label>
                </div>
                <div className="numberNightsValue">
                  <span>{Math.round(numberOfNights)}</span>
                </div>
              </div>
              <br></br>
              <div className="numberRooms">
                <div className="numberRoomsLabel">
                  <label>Number of Rooms</label>
                </div>
                <div className="numberRoomsValue">
                  <span>{rooms}</span>
                </div>
              </div>
              <br></br>
              <div className="numberGuests">
                <div className="numberGuestsLabel">
                  <label>Number of Guests</label>
                </div>
                <div className="numberGuestsValue">
                  <span>{adults} Adults, {children} Children</span>
                </div>
              </div>
              <div className="addedAttractions">
                {addedAttractions.length > 0 && (
                  <div className="addedAttractionsList">
                    <div className="addedAttractionsTitle">Added Attractions</div>
                    {addedAttractions.map((attraction, index) => (
                      <div key={index} className="addedAttractionsItem">
                        <div className="addedAttractionName">
                          <span>{attraction.ticketCount}X </span>
                          <span>{attraction.name} </span>
                        </div>
                        <div className="addedAttractionPrice">
                          <span>{attraction.price}€</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="addedFlights">
                {selectedFlight?.length > 0 && (
                <div className="addedFlightsList">
                  <div className="addedFlightsTitle">Added Flights</div>
                  {selectedFlight.map((flight, index) => (
                  <div key={index} className="addedFlightsItem">
                    <div className="addedFlightDetails">
                      <span>{flight.segments[0].departureAirport.cityName} - {flight.segments[0].arrivalAirport.cityName}</span>
                      <span>{format(new Date(flight.segments[0].departureTime), "dd/MM/yyyy HH:mm")} - {format(new Date(flight.segments[0].arrivalTime), "dd/MM/yyyy HH:mm")}</span>
                    </div>
                    <div className="addedFlightsPrice">
                      <span>{flight.priceBreakdown.total.units}€</span>
                    </div>
                  </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          </div>
          <div className="confirmDetails">
            <div className="confirmDetailsTitle">Confirm Your Details</div>
            <div className="confirmDetailsItem">
              <div className="itemName">
                <div className="nameLabel">
                  <label>First Name</label>
                </div>
                <div className="nameValue">
                  <input type="text" value={user.userName} readOnly />
                </div>
              </div>
              <div className="itemEmail">
                <div className="emailLabel">
                  <label>Email</label>
                </div>
                <div className="emailValue">
                  <input type="text" value={user.email} readOnly />
                </div>
              </div>
              <div className="itemPrice">
                <div className="priceLabel">
                  <label>Total Price Summary</label>
                </div>
                <div className="priceValue">
                  <span>Total Cost: {validatedAttractionPrice.toFixed(2)}€</span>
                  <p>Includes taxes and fees</p>
                </div>
              </div>
              <div className="itemPayDetails">
                <div className="payDetailsLabel">
                  <label>Payment Details</label>
                </div>
                <div className="payDetailsValue">
                  <CardElement />
                </div>
                <div className="buttonContainer">
                  <button
                    className={`bookButton ${paymentSuccess ? 'paidButton' : ''}`}
                    onClick={handleSubmit}
                    disabled={buttonDisabled}
                    style={{ backgroundColor: paymentSuccess ? 'green' : '', cursor: buttonDisabled ? 'not-allowed' : 'pointer' }}
                  >
                    {buttonText}
                  </button>
                </div>
                {showConfirmation && (
                  <div className="confirmationMessage">
                    Payment Successful!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};
Booking.propTypes = {
  socket: PropTypes.object
};

export default Booking;
