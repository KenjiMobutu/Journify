import "./taxiSearchList.css"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTaxi } from "../../redux/cartRedux.js";
import { useState } from "react";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';


const TaxiSearchList = ({ item, journeys, selectTaxi, errors }) => {
  console.log(item)
  console.log(journeys)
  const isHotelPage = location.pathname.includes("/hotels");
  const isTaxiPage = location.pathname.includes("/taxi");
  const navigate = useNavigate();
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const onSelect = (item) => {
    console.log("Selected Taxi:", item);
    navigate("/taxi/booking", { state: { taxi: item, journeys: journeys } });
  }

  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    console.log("Add to Cart:", item);
    dispatch(addTaxi({
      id: item.resultId,
      taxi: item,
      price: Math.round(item.price.amount) || 0,
      journeys: journeys
    }));

    // Affiche l'alerte
    setConfirmationVisible(true);
    // Cache l'alerte après 2 secondes
    setTimeout(() => {
      setConfirmationVisible(false);
    }, 2000);
  };

  const addToBooking = (item) => {
    console.log("Add to Booking:", item);
    selectTaxi(item, journeys);
  }

  return (
    <div className="taxiSearchList" >
      <div className="taxiSearchListTop">
        <label>Here is a resume of your Jouney:</label>
        <div className="supplier">
          <label>Supplier :  </label>
          <img src={item.imageUrl || ''} alt="taxi" />
          <span>{item.supplierName}</span>
        </div>
        <div className="taxiSearchListTopLeft">
          <p>{journeys[0].pickupLocation.name}</p>
        </div>
        <div className="taxiSearchListTopMiddle">
          <p>to</p>
        </div>
        <div className="taxiSearchListTopRight">
          <p>{journeys[0].dropOffLocation.name}</p>
        </div>
      </div>
      <div className="taxiSearchListBottom">
        <div className="distance">
          <label>Distance:</label>
          <span> {item.drivingDistance} km</span>
        </div>
        <div className="time">
          <label>Duration:</label>
          <span> {item.duration} min.</span>
        </div>
        <div className="category">
          <label>Category:</label>
          <span>{item.category}</span>
        </div>
        <div className="price">
          <label>Price:</label>
          <span> {Math.round(item.price.amount)} €</span>
        </div>
        {isHotelPage ?
          (errors.resultId === item.resultId && (
            <div className="flightError">
              <span className="flightErrorText">
                {errors.taxi}
              </span>
            </div>)
          ) : (<div></div>
          )}
      </div>
      {!isHotelPage && (
        <>
          <div className="taxiBtns">
            <button className="taxiBookButton" onClick={() => onSelect(item)}>Book Now</button>
            <button className="taxiCartButton" onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        </>
      )}
      {!isTaxiPage && (
        <div className="taxiAddToBooking">
          <button className="btnAddToBook" onClick={() => addToBooking(item)}>Add to Booking</button>
        </div>
      )}


      <div>

        {/* Afficher l'alerte si visible */}
        {confirmationVisible && (
          <div className="confirmationVisibility">
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              Élément ajouté au panier avec succès.
            </Alert>
          </div>
        )}
      </div>

    </div>
  )
}

export default TaxiSearchList
