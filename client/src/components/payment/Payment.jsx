import './payment.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import PropTypes from 'prop-types';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/cartRedux.js";

const Payment = ({ setOpenPayment, totalPrice, cart }) => {

  const token = localStorage.getItem('access_token');
  const { user } = useContext(AuthenticationContext);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [buttonText, setButtonText] = useState('Pay');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const dispatch = useDispatch();

  const hotels = cart.products;
  const attractions = cart.attractions;
  const flights = cart.flights;

  console.log("Cart: ", hotels, attractions, flights);


  const stripe = useStripe();
  const elements = useElements();


  const handleSubmit = async (e) => {
    e.preventDefault();

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
        body: JSON.stringify({ amount: totalPrice * 100 })
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
      for (const hotel of hotels) {
        const checkInDate = new Date(hotel.arrival_date);
        const checkOutDate = new Date(hotel.departure_date);

        // Calculer la différence en millisecondes
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();

        // Convertir la différence en jours
        const numberOfNights = timeDifference / (1000 * 3600 * 24);

        // Arrondir pour éviter les résultats avec des fractions
        const roundedNumberOfNights = Math.round(numberOfNights);

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
            checkIn: checkInDate,
            checkOut: checkOutDate,
            // adultsCount: adults,
            // childrenCount: children,
            // rooms,
            hotel: hotel._id,
            totalCost: Math.round(hotel.product_price_breakdown.all_inclusive_amount.value),
            numberOfNights: Math.round(roundedNumberOfNights),
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
      }

      // Handle payment for attractions and flights
      await handleExtraPayments(paymentIntent.id, token, user, attractions, flights);

      // Payment success actions
      setPaymentSuccess(true);
      setButtonText('Paid');
      setShowConfirmation(true);
      dispatch(resetCart(cart));
      setTimeout(() => setShowConfirmation(false), 5000);
    } catch (error) {
      console.error(error.message);
    } finally {
      setButtonDisabled(false);
    }
  }

  // Handle payment for attractions and flights
  const handleExtraPayments = async (paymentIntentId, token, user, attractions, flights) => {
    try {
      for (const attraction of attractions) {
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

      for (const flight of flights) {
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
            // adultsCount: adults,
            // childrenCount: children,
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
    <div className="payment">
      <div className='paymentContainer'>
        <FontAwesomeIcon className="reservClose" icon={faXmarkCircle} onClick={() => setOpenPayment(false)} />
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
                <span>Total Cost: {totalPrice}€</span>
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
    </div>

  )
}
Payment.propTypes = {
  setOpenPayment: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
  cart: PropTypes.shape({
    products: PropTypes.array.isRequired,
    attractions: PropTypes.array.isRequired,
    flights: PropTypes.array.isRequired,
  }).isRequired,
};

export default Payment;

