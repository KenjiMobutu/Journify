/* eslint-disable react/prop-types */
import "./flightSearchList.css";
import { format } from "date-fns";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import FlightLandOutlinedIcon from '@mui/icons-material/FlightLandOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFlight } from "../../redux/cartRedux.js";
import { useState } from "react";

const FlightSearchList = ({ item, onSelect, options, selectFlight, errors }) => {

  const isHotelPage = location.pathname.includes("/hotels");
  const isFlightPage = location.pathname.includes("/flights");
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${format(date, "dd MMM yyyy")} - ${format(date, "HH:mm")}`;
  };
  const navigate = useNavigate();


  onSelect = (item) => {
    console.log("Selected Flight:", item);
    navigate("/flights/booking", { state: { flight: item, options: options } });
  };
  const [selectedFlight, setSelectedFlight] = useState([]);
  const addToBooking = (item) => {
    console.log("Add to Booking:", selectedFlight);
    setSelectedFlight(item);
    selectFlight(item);
  };


  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    console.log("Add to Cart:", item);

    dispatch(addFlight({
      flightId: item.token,
      flight: item,
      price: item.priceBreakdown.total.units || 0
    }));

  };


  return (
    <div className="flightList">
      <div className="flightJourney">
        <div className="flightJourneyFrom">
          <FlightTakeoffOutlinedIcon className="flightJourneyIconTakeOff" />
          <div className="flightJourneyCode">
            {item.segments[0].departureAirport.code}
          </div>
          <div className="flightJourneyCompany">
            <div className="flightJourneyCompanyLogo">
              <img src={item.segments[0].legs[0].carriersData[0].logo} alt="logo" />
            </div>
            {item.segments[0].legs[0].carriersData[0].name}
          </div>
          <div className="flightJourneyTime">
            {formatDateTime(item.segments[0].departureTime)}
          </div>
        </div>

        <div className="flightJourneyArrow">
          <div className="flightJourneyLine"></div>
          <AirplanemodeActiveIcon className="flightJourneyIcon" />
        </div>

        <div className="flightJourneyTo">
          <FlightLandOutlinedIcon className="flightJourneyIconLand" />
          <div className="flightJourneyCode">
            {item.segments[0].arrivalAirport.code}
          </div>
          <div className="flightJourneyCompany">
            <div className="flightJourneyCompanyLogo">
              <img src={item.segments[0].legs[0].carriersData[1].logo} alt="logo" />
            </div>
            {item.segments[0].legs[0].carriersData[1].name}
          </div>
          <div className="flightJourneyTime">
            {formatDateTime(item.segments[0].arrivalTime)}
          </div>
        </div>
      </div>
      <div className="flightPrice">
        <span className="flightPriceText">
          Price: {item.priceBreakdown.total.units} €
        </span>
      </div>

      {isHotelPage ?
        (errors.flightId === item.token && (
          <div className="flightError">
            <span className="flightErrorText">
              {errors.flight}
            </span>
          </div>)
        ) : (<div></div>
        )}
      {!isHotelPage && (
        <>
          <div className="selectFlightButton">
            <button className="btnSelectFlight" onClick={() => onSelect(item)}>Pay Now</button>
          </div>

          <div className="addCartButton">
            <button className="btnAddCart" onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        </>
      )}


      {!isFlightPage && (
        <div className="addToBook">
          <button className="btnAddToBook" onClick={() => addToBooking(item)}>Add to Booking</button>
        </div>
      )}
    </div>
  );
};

export default FlightSearchList;
