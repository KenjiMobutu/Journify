/* eslint-disable react/prop-types */
import "./flightSearchList.css";
import { format } from "date-fns";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import FlightLandOutlinedIcon from '@mui/icons-material/FlightLandOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import { useNavigate } from "react-router-dom";

const FlightSearchList = ({ item, onSelect, options }) => {
  console.log(item);
  console.log(options);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${format(date, "dd MMM yyyy")} - ${format(date, "HH:mm")}`;
  };
  const navigate = useNavigate();


  onSelect = (item) => {
    console.log("Selected Flight:", item);
    navigate("/flights/booking", { state: { flight: item , options: options} });
  };

  return (
    <div className="flightList" onClick={() => onSelect(item)}>
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

      <div className="selectFlightButton">
        <button className="btnSelectFlight">Select Flight</button>
      </div>
    </div>
  );
};

export default FlightSearchList;
