import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/navbar/Navbar"
import "./cart.css"
import { useState, useEffect, useRef } from "react"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { removeProduct, removeFlight, removeTaxi, resetCart, removeAttraction } from "../../redux/cartRedux.js";
import { Link } from "react-router-dom";
import attractionImg from '../../assets/attractions.png';
import flightQrCode from '../../assets/flightQrCode.png';

const Cart = () => {
  const [hotelPhoto, setHotelPhoto] = useState([]);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Fonction pour calculer le total dynamiquement
  const calculateTotal = () => {
    const hotelTotal = cart.products.reduce((sum, product) => sum + Math.round(product.product_price_breakdown.all_inclusive_amount.value), 0);
    const attractionTotal = cart.attractions.reduce((sum, attraction) => sum + Math.round(attraction.price), 0);
    const flightTotal = cart.flights.reduce((sum, flight) => {
      const flightData = Array.isArray(flight.flights) ? flight.flights[0] : flight.flights || flight;
      return sum + (flightData?.priceBreakdown?.total?.units || flightData?.flight.priceBreakdown?.total?.units || 0);
    }, 0);
    return hotelTotal + attractionTotal + flightTotal;
  };

  console.log(cart.flights.map((flight) => {
    return flight;
    // const flightData = Array.isArray(flight.flights) ? flight.flights[0] : flight.flights || flight;
    // const segments = flightData.segments;
    // return segments[0];
  }));

  console.log(cart);


  useEffect(() => {
    const newHotelPhotos = cart.products.reduce((photos, product) => {
      const rooms = product.rooms;
      const firstRoomKey = Object.keys(rooms)[0];
      const firstRoom = rooms[firstRoomKey];
      const firstPhoto = firstRoom.photos[0];
      return [...photos, firstPhoto];
    }, []);
    setHotelPhoto(newHotelPhotos);
  }, [cart.products]);

  const handleDeleteHotel = (product) => {
    console.log(product);
    dispatch(removeProduct(product));
  };

  const handleDeleteFlight = (flight) => {
    console.log(flight);
    dispatch(removeFlight(flight));
  };

  const handleDeleteAttraction = (attraction) => {
    console.log(attraction);
    dispatch(removeAttraction(attraction));
  }

  const handleDeleteTaxi = (taxi) => { }

  const handleResetCart = (cart) => {
    dispatch(resetCart(cart));
  }

  return (
    <div>
      <Navbar />
      <div className="cartContainer">
        <div className="cartTitle">
          <h1>YOUR ORDER</h1>
        </div>
        <div className="cartTop">
          <Link to="/" >
            <div className="cartTopButton">Continue Booking</div>
          </Link>
          <div className="cartTopTexts">
            <p>Shopping Bag({cart.quantity})</p>
          </div>
          <div className="cartTopButton" onClick={() => handleResetCart(cart)}>Clear your basket</div>
        </div>
        <div className="cartBottom">
          <div className="cartLeft">
            <div className="cartProducts">
              {/* Vérification si le panier est vide */}
              {cart.products.length === 0 &&
                cart.attractions.length === 0 &&
                cart.flights.length === 0 &&
                cart.taxis.length === 0 ? (
                <p>Your cart is empty.</p> // Affiche un message si le panier est vide
              ) : (
                cart.products.map((product, index) => (
                  <div className="cartProduct" key={product.id || index}>
                    {hotelPhoto[index] && (
                      <div className="hotelImageContainer">
                        <img
                          src={hotelPhoto[index].url_max300}
                          alt={`Hotel photo ${index}`}
                          className="hotelPhoto"
                        />
                      </div>
                    )}
                    <div className="cartProductDetails">
                      <div className="cartProductHeader">
                        <span className="cartProductName">
                          <b>Hotel:</b> {product.hotel_name}
                        </span>
                        <span className="cartProductPrice">
                          <b>Total Price:</b>{" "}
                          {Math.round(product.product_price_breakdown.all_inclusive_amount.value)} €
                        </span>
                      </div>
                      <div className="cartProductBody">
                        <div className="cartProductCheckInOut">
                          <div className="checkIn">
                            <b>Check-in:</b> {product.arrival_date}
                          </div>
                          <div className="checkOut">
                            <b>Check-out:</b> {product.departure_date}
                          </div>
                        </div>
                        <div className="cartProductInfo">
                          <b>Room(s):</b> {product.rooms.length} room(s) booked
                        </div>
                      </div>
                      <div className="cartDelete">
                        <button onClick={() => handleDeleteHotel(product)}>
                          <DeleteForeverOutlinedIcon className="cartTrash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <hr></hr>
              {cart.attractions.map((attraction, index) => (
                <div className="ticketContainer" key={attraction.id || index}>
                  <div className="ticketHeader">
                    <img src={attractionImg} alt="Attraction" className="attractionImg" />
                    <span className="attractionName"><b>{attraction.name}</b></span>
                  </div>

                  <div className="ticketBody">
                    <div className="ticketDetails">
                      <div className="ticketInfo">
                        <span className="cartProductPrice">
                          <b>Price: </b>{attraction.price} €
                        </span>
                      </div>
                      <div className="ticketInfo">
                        <b>Ticket(s): </b>{attraction.ticketCount}
                      </div>
                    </div>

                    <div className="ticketActions">
                      <button onClick={() => handleDeleteAttraction(attraction)} className="deleteTicketButton">
                        <DeleteForeverOutlinedIcon className="deleteIcon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <hr></hr>
              {cart.flights.map((flight, index) => {
                const flightData = (Array.isArray(flight.flights) ? flight.flights[0] : flight.flights) || flight;
                const segments = flightData?.segments || flightData?.flight.segments || [];
                if (segments.length === 0) return null;

                return (
                  <div className="flightTicket" key={flight.id || index}>
                    <div className="flightTicketBody">
                      <div className="flightRoute">
                        <div className="flightDeparture">
                          <div className="airportCode">{segments[0].departureAirport?.code}</div>
                          <div className="airportName">{segments[0].departureAirport?.cityName}</div>
                          <div className="departureTime">
                            {new Intl.DateTimeFormat('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }).format(new Date(segments[0].departureTime))}
                          </div>
                        </div>
                        <div className="flightArrow">→</div>
                        <div className="flightArrival">
                          <div className="airportCode">{segments[0].arrivalAirport?.code}</div>
                          <div className="airportName">{segments[0].arrivalAirport?.cityName}</div>
                          <div className="arrivalTime">
                            {new Intl.DateTimeFormat('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }).format(new Date(segments[0].arrivalTime))}
                          </div>
                        </div>
                      </div>

                      <div className="flightTicketFooter">
                        <div className="flightPrice">
                          <b>Price: </b>{flightData?.priceBreakdown?.total?.units || flightData?.flight.priceBreakdown?.total?.units || 'N/A'} €
                        </div>
                        <div className="deleteFlightButton">
                          <button onClick={() => handleDeleteFlight(flight)}>
                            <DeleteForeverOutlinedIcon className="cartTrash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
          <div className="cartRight">
            <div className="cartInfo">
              <p className="cartInfoText">ORDER SUMMARY</p>
              <div className="cartInfoPrice">
                <span>Total: {Math.round(calculateTotal())} €</span>
                <span>Subtotal: {Math.round(calculateTotal())} €</span>
              </div>
              <div className="cartInfoButton">
                <button>Proceed To Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
