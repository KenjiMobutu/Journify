import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/navbar/Navbar"
import "./cart.css"
import { useState, useEffect } from "react"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { removeProduct } from "../../redux/cartRedux.js";
import { Link } from "react-router-dom";

const Cart = () => {
  const [hotelPhoto, setHotelPhoto] = useState([]);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

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
          <div className="cartTopButton">Checkout Now</div>
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
                      <img
                        src={hotelPhoto[index].url_max300}
                        alt={`Hotel photo ${index}`}
                        className="hotelPhoto"
                      />
                    )}
                    <div className="cartProductDetails">
                      <div className="cartProductInfo">
                        <span className="cartProductName">
                          <b>Product: </b> {product.hotel_name}
                        </span>
                        <span className="cartProductSize">
                          {Math.round(
                            product.product_price_breakdown.all_inclusive_amount.value
                          )}{" "}
                          €
                        </span>
                        <span className="cartProductSize">
                          <b>Check-in: </b> {product.arrival_date}
                        </span>
                        <span className="cartProductSize">
                          <b>Check-out: </b> {product.departure_date}
                        </span>
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
              <div className="cartProduct">
                <img
                  src="https://images.unsplash.com/photo-1556740731-0a7b3b6e4d9e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                  alt=""
                  className="cartProductImage"
                />
                <div className="cartProductDetails">
                  <span className="cartProductName">
                    <b>Product: </b> JESSIE THUNDER SHOES
                  </span>
                  <span className="cartProductId">
                    <b>ID: </b> 93813718293
                  </span>
                  <span className="cartProductColor">
                    <b>Color: </b> Black
                  </span>
                  <span className="cartProductSize">
                    <b>Size: </b> 37.5
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="cartRight">
            <div className="cartInfo">
              <p className="cartInfoText">ORDER SUMMARY</p>
              <div className="cartInfoPrice">
                <span>Total: {Math.round(cart.total)} €</span>

                <span>Subtotal: {Math.round(cart.total)} €</span>
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
