import "./moreBookings.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PropTypes from "prop-types";

const MoreBookings = ({ setOpen, setOpenPayment, onConfirm }) => {
  MoreBookings.propTypes = {
    setOpen: PropTypes.func.isRequired,
    setOpenPayment: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  };

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
        </div>

        <div className="moreBookingsButtonContainer">
          <label className="moreBookingsButton">
            <input
              type="checkbox"
              value="taxi"
              checked={selectedOptions.taxi}
              onChange={() => handleOptionChange("taxi")}
            />
            <span>Taxi</span>
          </label>
        </div>
        <span className="moreBookingsText">to your reservation?</span>
        <div className="moreBookingsActions">
          <button className="moreBookingsConfirm" onClick={handleConfirm}>
            Let&rsquo;s go!
          </button>
          <button
            className="moreBookingsConfirm"
            onClick={() => {
              setOpenPayment(true);
              setOpen(false);
            }}
          >
            No, it&rsquo;s ok
          </button>
        </div>
      </div>
    </div>
  )
}

export default MoreBookings
