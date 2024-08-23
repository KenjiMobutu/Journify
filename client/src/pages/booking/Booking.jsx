import "./booking.css";
import { useContext } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { io } from "socket.io-client";

const Booking = () => {
  const socket = io("http://localhost:3000")
  const [paymentSuccess, setPaymentSuccess] = useState(false);  // État pour le succès du paiement
  const [showConfirmation, setShowConfirmation] = useState(false);  // État pour afficher la confirmation
  const [buttonDisabled, setButtonDisabled] = useState(false);  // État pour désactiver le bouton
  const [buttonText, setButtonText] = useState('Payer');  // Texte du bouton

  const { user } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const stripe = useStripe();
  const elements = useElements();


  const startDate = new Date(params.get('startDate')); // Utiliser le constructeur Date pour les dates
  const endDate = new Date(params.get('endDate'))
  const adults = params.get('adults');
  const children = params.get('children');
  const rooms = params.get('rooms');
  const hotel = JSON.parse(params.get('hotel'));
  const price = params.get('price');

  // Format dates to dd/MM/yyyy
  const formattedStartDate = format(startDate, "dd/MM/yyyy");
  const formattedEndDate = format(endDate, "dd/MM/yyyy");

  // Calculer le nombre de nuits
  const timeDifference = endDate.getTime() - startDate.getTime();
  const numberOfNights = timeDifference / (1000 * 3600 * 24);


  if (!user) {
    // Redirige l'utilisateur vers la page de connexion si non authentifié
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
      setButtonDisabled(true);  // Désactiver le bouton pendant le traitement du paiement

      // Créer un Payment Intent et récupérer le client_secret
      const paymentIntentRes = await fetch('/api/hotels/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price * 100 }) // Convertir le prix en centimes
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
      const response = await fetch(`/api/hotels/${hotel.hotel_id}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          rooms: rooms,
          hotel: hotel._id,
          totalCost: price,
          numberOfNights: numberOfNights,
          address: hotel.address,
          zip: hotel.zip,
          city: hotel.city_trans,
          country: hotel.country_trans,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to book: ${response.statusText}`);
      }

      await response.json();


      // Gestion du succès du paiement
      setPaymentSuccess(true);  // Marquer le paiement comme réussi
      setButtonText('Paid');  // Changer le texte du bouton
      setShowConfirmation(true);  // Afficher la fenêtre de confirmation
      socket?.emit("notificationBooking", user.userName + " made a new booking");  // Envoyer une notification de nouvelle réservation
      // Masquer la confirmation après 5 secondes
      setTimeout(() => {
        setShowConfirmation(false);
      }, 5000);

    } catch (err) {
      console.error('Error during payment or booking:', err);
      setButtonDisabled(false);  // Réactiver le bouton en cas d'erreur
    }
  };


  return (
    <div>
      <Navbar />
      {user ? (
        <div className="bookingContainer">
          <div className="details">
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
                  <span>{numberOfNights}</span>
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
                  <span>Total Cost: {price}€</span>
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

export default Booking;
