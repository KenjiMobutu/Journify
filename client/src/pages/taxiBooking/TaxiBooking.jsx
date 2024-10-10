import "./taxiBooking.css"
import { useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import { format } from 'date-fns';



const TaxiBooking = ({socket}) => {
  const token = localStorage.getItem('access_token');
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { taxi, journeys } = location.state || {};
  const [paymentSuccess, setPaymentSuccess] = useState(false);  // État pour le succès du paiement
  const [showConfirmation, setShowConfirmation] = useState(false);  // État pour afficher la confirmation
  const [buttonDisabled, setButtonDisabled] = useState(false);  // État pour désactiver le bouton
  const [buttonText, setButtonText] = useState('Pay');
  const { user } = useContext(AuthenticationContext);
  const stripe = useStripe();
  const elements = useElements();

  console.log("TAXI:", taxi);
  console.log("OPTIONS:", journeys);

  const formatDate = (dateTime) => {
    return format(new Date(dateTime), "dd/MM/yyyy");
  };
  const name = taxi.supplierName;
  const type = taxi.vehicleType;
  const price = taxi.price.amount;
  const priceInCents = Math.ceil(price * 100);
  console.log("PRICE IN CENTS:", priceInCents);
  const description = taxi.descriptionLocalised;
  const departure = journeys[0].pickupLocation.name;
  const arrival = journeys[0].dropOffLocation.name;
  const date = new Date(journeys[0].requestedPickupDateTime);
  const time = new Date(journeys[0].requestedPickupDateTime).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const distance = taxi.drivingDistance;
  const photos = taxi.imageUrl;

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

      const paymentIntentRes = await fetch(`/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: priceInCents }),
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
      const response = await fetch(`/api/payment/taxi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          taxiId: taxi._id,
          _id: user._id,
          userName: user.userName,
          userEmail: user.email,
          name: name,
          type: type,
          price: price,
          description: description,
          departure: departure,
          arrival: arrival,
          date: date,
          time: time,
          distance: distance,
          photos: photos,
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
        socket?.emit("notificationTaxiBooking", user.userName + " booked a Taxi.");
        setTimeout(() => {
          setShowConfirmation(false);
        }, 5000);
      } else {
        setButtonDisabled(false);
        setButtonText('Pay');
        console.error('Failed to process payment');
      }

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Navbar socket={socket}/>
      <div className="taxiBookingContainer">
        <div className="bookingTaxiContainer">
          <div className="detailsTaxiBooking">
            <div className="taxiDetails">
              <div className="taxiDetailsBookingTitle">
                Your Taxi Details
              </div>
              <div className="taxiBookingItem">
                <div className="taxiBookingName">
                  <label>Name: </label>
                  <div>{name}</div>
                </div>
                <div className="taxiBookingPhotos">
                  <label>Photos: </label>
                  <div>
                    <img src={photos} alt="taxi" />
                  </div>
                </div>
                <div className="taxiBookingFrom">
                  <label>From: </label>
                  <div className="taxiBookingDe">
                    {departure}
                  </div>
                </div>
                <div className="taxiBookingTo">
                  <label>To: </label>
                  <div className="taxiBookingArrival">
                    {arrival}
                  </div>
                </div>
                <div className="taxiBookingDate">
                  <label>Date: </label>
                  <div>{new Date(journeys[0].requestedPickupDateTime).toLocaleString('en-GB', { dateStyle: 'short' })}</div>
                </div>
                <div className="taxiBookingTime">
                  <label>Time: </label>
                  <div>{new Date(journeys[0].requestedPickupDateTime).toLocaleString('en-GB', { timeStyle: 'short' })}</div>
                </div>
                <div className="taxiBookingDistance">
                  <label>Distance: </label>
                  <div>{distance} km</div>
                </div>
                <div className="taxiBookingType">
                  <label>Type: </label>
                  <div>{type}</div>
                </div>
                <div className="taxiBookingDescription">
                  <label>Description: </label>
                  <div>{description}</div>
                </div>
                <div className="taxiBookingPrice">
                  <label>Price: </label>
                  <div>{price} €</div>
                </div>
              </div>
            </div>

            <div className="paymentDetailsItem">
              <div className="paymentDetailsTitle">
                Payment Details
              </div>
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
                <div>Total Cost: {price} €</div>
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
      </div>
    </>
  )
}

export default TaxiBooking
