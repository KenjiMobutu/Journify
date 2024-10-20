import './payment.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import PropTypes from 'prop-types';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/cartRedux.js";
import axios from "axios";

const Payment = ({ setOpenPayment, totalPrice, cart, socket }) => {

  const token = localStorage.getItem('access_token');
  const { user } = useContext(AuthenticationContext);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [buttonText, setButtonText] = useState('Pay');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const hotels = cart.products;
  const attractions = cart.attractions;
  const flights = cart.flights;
  const taxis = cart.taxis;

  console.log("Cart: ", hotels, attractions, flights, taxis);


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

      // // Fetch payment intent
      // const paymentIntentRes = await fetch(`${apiUrl}/api/hotels/create-payment-intent`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ amount: totalPrice * 100 })
      // });
      // Fetch payment intent
      const paymentIntentRes = await axios.post(`${apiUrl}/api/hotels/create-payment-intent`,
        { amount: totalPrice * 100 },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      );

      if (paymentIntentRes.status !== 200) {
        throw new Error(`Failed to create payment intent: ${paymentIntentRes.statusText}`);
      }

      const paymentIntentData = await paymentIntentRes.data;
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

        const bookingResponse = await axios.post(`${apiUrl}/api/hotels/${hotel.hotel_id}/bookings`,
          {
            paymentIntentId: paymentIntent.id,
            _id: user._id,
            userName: user.userName,
            userEmail: user.email,
            hotelName: hotel.hotel_name,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            adultsCount: hotel.options.adult,
            childrenCount: hotel.options.children,
            rooms: hotel.options.room,
            hotel: hotel._id,
            totalCost: Math.round(hotel.product_price_breakdown.all_inclusive_amount.value),
            numberOfNights: Math.round(roundedNumberOfNights),
            address: hotel.address || 'Unknown',
            zip: hotel.zip || '',
            city: hotel.city_trans,
            country: hotel.country_trans
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Si vous avez besoin d'envoyer des cookies avec la requête
          }
        );

        if (bookingResponse.status !== 200) {
          throw new Error(`Failed to book: ${bookingResponse.statusText}`);
        }

        //await bookingResponse;
      }

      // Handle payment for attractions and flights
      await handleExtraPayments(paymentIntent.id, token, user, attractions, flights, taxis);

      // Payment success actions
      setPaymentSuccess(true);
      setButtonText('Paid');
      socket?.emit("notificationBooking", { userName: user.userName, userId: user._id });
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
  const handleExtraPayments = async (paymentIntentId, token, user, attractions, flights, taxis) => {
    try {
      for (const attraction of attractions) {
        const attractionResponse = await axios.post(`${apiUrl}/api/payment/attraction`,
          {
            paymentIntentId,
            _id: user._id,
            userName: user.userName,
            userEmail: user.email,
            ...attraction,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (attractionResponse.status !== 200) {
          throw new Error('Payment failed for attraction');
        }
      }

      for (const taxi of taxis) {
        if (!taxi || !taxi.journeys || !taxi.journeys[0]) {
          console.error('Taxi data is incomplete or invalid:', taxi);
          continue; // Passer à l'itération suivante si les données du taxi sont invalides
        }

        // Debugging info
        console.log("Taxi: ", taxi);
        console.log("Taxi name: ", taxi.supplierName);
        console.log("Taxi price: ", taxi?.price?.amount || taxi.price);

        // Extraction des informations de date et heure
        const requestedPickupDateTime = new Date(taxi.journeys[0].requestedPickupDateTime);
        const date = requestedPickupDateTime.toISOString().split('T')[0];
        const time = requestedPickupDateTime.toTimeString().split(' ')[0].slice(0, 5);

        // Préparation du corps de la requête pour la réservation du taxi
        const taxiResponse = await axios.post(`${apiUrl}/api/payment/taxi`,
          {
            paymentIntentId,
            _id: user._id,
            userName: user.userName,
            userEmail: user.email,
            name: taxi?.taxi?.supplierName || taxi.supplierName,
            price: Math.round(taxi?.price?.amount || taxi.price), // S'assurer que le prix est un nombre
            type: taxi?.taxi?.category || taxi.category,
            description: taxi?.taxi?.descriptionLocalised || taxi.descriptionLocalised,
            departure: taxi.journeys[0].pickupLocation.name,
            date: date,
            time: time,
            arrival: taxi.journeys[0].dropOffLocation.name,
            distance: taxi?.taxi?.drivingDistance || taxi.drivingDistance,
            photos: taxi?.taxi?.imageUrl || taxi.imageUrl,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Si vous avez besoin d'envoyer des cookies avec la requête
          }
        );

        // Vérification de la réponse
        if (taxiResponse.status !== 200) {
          console.error('Failed to save taxi booking:', taxiResponse.statusText);
          throw new Error('Payment failed for taxi');
        }

      }

      for (const flight of flights) {
        if (!flight || !flight.segments || !flight.segments[0]) {
          console.error('Flight data is incomplete or invalid:', flight);
          continue; // Skip this flight if the data is incomplete
        }
        console.log("Flight: ", flight);
        const flightResponse = await axios.post(`${apiUrl}/api/payment/bookings`,
          {
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
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Si vous avez besoin d'envoyer des cookies
          }
        );
        if (flightResponse.status !== 200) {
          console.error('Failed to save flight booking:', flightResponse.statusText);
          throw new Error('Payment failed for flight');
        }
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
    taxis: PropTypes.array.isRequired,
  }).isRequired,
};

export default Payment;

