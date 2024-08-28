import "./moreBookings.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { CheckBox } from "@mui/icons-material";

const MoreBookings = ({ setOpen, setOpenPayment }) => {

  const handleConfirm = () => { };

  return (
    <div className="moreBookings">
      <div className="moreBookingsContainer">
        <FontAwesomeIcon
          className="reservClose"
          icon={faXmarkCircle}
          onClick={() => setOpen(false)} // Ferme la modal lorsqu'on clique sur l'icône
        />
        <span className="moreBookingsText">Would you want to add </span>
        <div className="moreBookingsButtonContainer">
          <label className="moreBookingsButton">
            <input type="checkbox" value="flight" /> <span>Flight</span>
          </label>
          <label className="moreBookingsButton">
            <input type="checkbox" value="attractions" /> <span>Attractions</span>
          </label>
          <label className="moreBookingsButton">
            <input type="checkbox" value="taxi" /> <span>Taxi</span>
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
