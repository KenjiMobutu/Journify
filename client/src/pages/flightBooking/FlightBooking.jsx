import "./flightBooking.css";
import { useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { format } from 'date-fns';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from 'react-router-dom';

const FlightBooking = ({socket}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, options } = location.state || {};// Récupération du flight depuis le state
  const [paymentSuccess, setPaymentSuccess] = useState(false);  // État pour le succès du paiement
  const [showConfirmation, setShowConfirmation] = useState(false);  // État pour afficher la confirmation
  const [buttonDisabled, setButtonDisabled] = useState(false);  // État pour désactiver le bouton
  const [buttonText, setButtonText] = useState('Payer');
  const { user } = useContext(AuthenticationContext);
  const stripe = useStripe();
  const elements = useElements();
  console.log("OPTIONS:", options);
  console.log("FLIGHT:", flight);
  console.log("USER:", user);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // const startDate = new Date(params.get('startDate')); // Utiliser le constructeur Date pour les dates
  // const endDate = new Date(params.get('endDate'))

  const formatDate = (dateTime) => {
    return format(new Date(dateTime), "dd/MM/yyyy");
  };

  const departureAirport = flight.segments[0].departureAirport.code;
  const arrivalAirport = flight.segments[0].arrivalAirport.code;
  const depDate = formatDate(flight.segments[0].departureTime);
  const arrDate = formatDate(flight.segments[0].arrivalTime);
  const departureDate = new Date(flight.segments[0].departureTime);
  const arrivalDate = new Date(flight.segments[0].arrivalTime);
  const totalCost = flight.priceBreakdown.total.units;
  const adultsCount = options.adult;
  const childrenCount = options.children;
  const cabinClass = options.cabinClass;

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      setButtonDisabled(true);
      setButtonText('Processing...');

      const paymentIntentRes = await fetch(`${apiUrl}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalCost }),
      });

      if (!paymentIntentRes.ok) {
        throw new Error(`Failed to create payment intent: ${paymentIntentRes.statusText}`);
      }

      const paymentIntentData = await paymentIntentRes.json();

      // Vérification du client_secret
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
        console.error('Payment error:', error);
        setButtonDisabled(false);  // Réactiver le bouton en cas d'erreur
        return; // Arrêtez l'exécution si une erreur de paiement se produit
      }

      // Enregistrez la réservation après la réussite du paiement
      const response = await fetch(`${apiUrl}/api/payment/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          flightId: flight._id,
          _id: user._id,
          userName: user.userName,
          userEmail: user.email,
          departureAirport: departureAirport,
          arrivalAirport: arrivalAirport,
          departureDate: departureDate,
          arrivalDate: arrivalDate,
          adultsCount: adultsCount,
          childrenCount: childrenCount,
          cabinClass: cabinClass,
          totalCost: totalCost,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to book: ${response.statusText}`);
      }

      await response.json();

      if (response.ok) {
        setPaymentSuccess(true);
        setShowConfirmation(true);
        setButtonText('Paid');
        socket?.emit("notificationFlightBooking", user.userName + " booked a new flight.");
        setTimeout(() => {
          setShowConfirmation(false);
        }, 5000);
      } else {
        setButtonDisabled(false);
        setButtonText('Pay');
        console.error('Failed to process payment');
      }

    } catch (error) {
      console.error('Error during payment or booking:', error);
      setButtonDisabled(false);
    }

  };

  return (
    <>
      <Navbar socket={socket}/>
      <div className="flightBookingContainer">
        <div className="bookingFlightContainer">

          {flight ? (
            <div className="detailsFlightBooking">
              <div className="flightDetails">
                <div className="flightDetailsBookingTitle">
                  Your Flight Details
                </div>
                <div className="flightBookingItem">
                  <div className="flightBookingFrom">
                    <label>From: </label>
                    <div className="flightBookingCode">
                      {departureAirport}
                    </div>
                    <div className="flightBookingTime">
                      {depDate}
                    </div>
                  </div>
                  <div className="flightBookingTo">
                    <label>To: </label>
                    <div className="flightBookingCode">
                      {arrivalAirport}
                    </div>
                    <div className="flightBookingTime">
                      {arrDate}
                    </div>
                  </div>
                  <div className="numbersTravellers">
                    <label>Number of travellers</label>
                    <div className="numbersTravellersCount">
                      <div>Adults: {adultsCount}</div>
                      <div>Children: {childrenCount}</div>
                    </div>
                  </div>
                  <div className="cabinClass">
                    <label>Cabin Class: </label>
                    <div>{cabinClass}</div>
                  </div>
                  <div className="flightBookingPrice">
                    <label>Price: </label>
                    <div>{totalCost} €</div>
                  </div>
                </div>
              </div>

              <div className="paymentDetails">
                <div className="paymentDetailsTitle">
                  Payment Details
                </div>
                <div className="paymentDetailsItem">
                  <div className="paymentDetailsName">
                    <label>First Name</label>
                    <div>{user.userName}</div>
                  </div>
                  <div className="paymentDetailsEmail">
                    <label>Email</label>
                    <div>{user.email}</div>
                  </div>
                  <div className="paymentDetailsPrice">
                    <label>Total Price Summary</label>
                    <div>Total Cost: {totalCost} €</div>
                    <p>Includes taxes and fees</p>
                  </div>
                  <div className="paymentDetailsPay">
                    <label>Payment Details</label>
                    <div>
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
            <p>No flight selected</p>
          )}
        </div>
      </div>
    </>
  );
};

export default FlightBooking;
