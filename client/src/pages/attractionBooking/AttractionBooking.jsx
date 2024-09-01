import "./attractionBooking.css"
import { useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import { format } from 'date-fns';

const AttractionBooking = ({ socket }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { attraction, startDate, endDate } = location.state || {};
  const [paymentSuccess, setPaymentSuccess] = useState(false);  // État pour le succès du paiement
  const [showConfirmation, setShowConfirmation] = useState(false);  // État pour afficher la confirmation
  const [buttonDisabled, setButtonDisabled] = useState(false);  // État pour désactiver le bouton
  const [buttonText, setButtonText] = useState('Pay');
  const { user } = useContext(AuthenticationContext);
  const stripe = useStripe();
  const elements = useElements();

  console.log("ATTRACTION:", attraction);

  const name = attraction.name;
  const price = attraction.representativePrice.publicAmount;
  const priceInCents = Math.ceil(price * 100);
  const description = attraction.shortDescription;
  const city = attraction.ufiDetails.bCityName;
  const photos = attraction.primaryPhoto.small;

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

      const paymentIntentRes = await fetch('/api/payment/create-payment-intent', {
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
      const response = await fetch(`/api/payment/attraction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          attractionId: attraction._id,
          _id: user._id,
          userName: user.userName,
          userEmail: user.email,
          name: name,
          price: price,
          city: city,
          description: description,
          startDate: startDate.$d,
          endDate: endDate.$d,
          photos: photos,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to book: ${response.statusText}`);
      }

      await response.json();

      if (response.ok) {
        setPaymentSuccess(true);
        setButtonText('Paid');
        setShowConfirmation(true);
        socket?.emit("notificationAttractionBooking", user.userName + " booked an attraction.");
        setTimeout(() => {
          setShowConfirmation(false);
        }, 5000);
      } else {
        setButtonDisabled(false);
        setButtonText('Pay');
        console.error('Failed to create payment method:', response);
      }
    } catch (error) {
      setButtonDisabled(false);
      setButtonText('Pay');
      console.error('Failed to create payment method:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="attBookingContainer">
        <div className="bookingAttContainer">
          <div className="detailsAttBookings">
            <div className="attDetails">
              <div className="attDetailsBookingTitle">
                <h1>Your Attraction Booking</h1>
              </div>
              <div className="attBookingItem">
                <div className="attractionName">
                  <label>Name: </label>
                  <div>{name}</div>
                </div>
                <div className="attractionCity">
                  <label>City: </label>
                  <div>{city}</div>
                </div>
                <div className="taxiBookingPhotos">
                  <label>Photo: </label>
                  <div>
                    <img src={photos} alt="taxi" />
                  </div>
                </div>
                <div className="attractionDescription">
                  <label>Description: </label>
                  <div>{description}</div>
                </div>
              </div>
            </div>

            <div className="paymentAttBooking">
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

export default AttractionBooking
