import "./attractionSearchList.css"
import { useNavigate } from "react-router-dom";

const AttractionSearchList = ({item, startDate, endDate}) => {
  const navigate = useNavigate();
  const onSelect = (item) => {
    console.log("Selected Attraction:", item);
    navigate("/attractions/booking", { state: { attraction: item , startDate: startDate, endDate: endDate} });
  };


  return (
    <div className="attractionSearchList" onClick={() => onSelect(item)}>
      <div className="attractionSearchListTop">
        <div className="supplier">
          <img src={item.primaryPhoto.small || ''} alt="attraction" />
          <span>{item.name}</span>
        </div>
        <div className="attractionSearchListTopLeft">
          <p>{item.shortDescription}</p>
        </div>
      </div>
      <div className="attractionSearchListBottom">
        <div className="category">
          <label>Rating:</label>
          <span>{item.reviewsStats?.combinedNumericStats?.average ?? "No Rating"}</span>
        </div>
        <div className="price">
          <label>Price:</label>
          <span> {item.representativePrice.publicAmount} € / pp.</span>
        </div>
      </div>
    </div>
  )
}

export default AttractionSearchList
