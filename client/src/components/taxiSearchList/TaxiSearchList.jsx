import "./taxiSearchList.css"
import { useNavigate } from "react-router-dom";

const TaxiSearchList = ({item, journeys}) => {
  console.log(item)
  console.log(journeys)
  const navigate = useNavigate();

  const onSelect = (item) => {
    console.log("Selected Taxi:", item);
    navigate("/taxi/booking", {state: {taxi: item}});
  }

  return (
    <div className="taxiSearchList" onClick={() => onSelect(item)}>
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
          <span> {item.price.amount} €</span>
        </div>

      </div>
    </div>
  )
}

export default TaxiSearchList
