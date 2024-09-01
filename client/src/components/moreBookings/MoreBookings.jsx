import "./moreBookings.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { CheckBox } from "@mui/icons-material";
import { useState } from "react";

const MoreBookings = ({ setOpen, setOpenPayment, onConfirm }) => {

  const [selectedOptions, setSelectedOptions] = useState({
    flight: false,
    attractions: false,
    taxi: false,
  });

  const handleOptionChange = (option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const handleConfirm = () => {
    console.log("Selected Options:", selectedOptions);
    onConfirm(selectedOptions);
    setOpen(false);

  };

  const handleFlight = () => { console.log("Flight") };

  const handleAttraction = () => { console.log("ATTRACTION") };

  const handleTaxi = () => { console.log("TAXI") };

  return (
    <div className="moreBookings">
      <div className="moreBookingsContainer">
        <FontAwesomeIcon
          className="reservClose"
          icon={faXmarkCircle}
          onClick={() => setOpen(false)} // Ferme la modal lorsqu'on clique sur l'icône
        />
        <span className="moreBookingsText">Would you like to add </span>
        <div className="moreBookingsButtonContainer">
          <label className="moreBookingsButton">
            <input
              type="checkbox"
              value="flight"
              checked={selectedOptions.flight}
              onChange={() => handleOptionChange("flight")}
            />
            <span>Flight</span>
          </label>
          <label className="moreBookingsButton">
            <input
              type="checkbox"
              value="attractions"
              checked={selectedOptions.attractions}
              onChange={() => handleOptionChange("attractions")}
            />
            <span>Attractions</span>
          </label>
          <label className="moreBookingsButton">
            <input
              type="checkbox"
              value="taxi"
              checked={selectedOptions.taxi}
              onChange={() => handleOptionChange("taxi")}
            />
            <span onClick={handleTaxi}>Taxi</span>
          </label>
        </div>
        <span className="moreBookingsText">to your reservation?</span>
        <div className="moreBookingsActions">
          <button className="moreBookingsConfirm" onClick={handleConfirm}>
            Let's go!
          </button>
          <button
            className="moreBookingsConfirm"
            onClick={() => {
              setOpenPayment(true);
              setOpen(false);
            }}
          >
            No, it's ok
          </button>
        </div>
      </div>
    </div>
  )
}

export default MoreBookings
