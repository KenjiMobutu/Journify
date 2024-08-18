import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./reservation.css"
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import useFetch from "../../hooks/useFetch"
import { useState } from "react"
import { useContext } from "react"
import { SearchContext } from "../../context/SearchContext.jsx"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Reservation({ setOpen, hotelId  }) {
  const { data, loading, error } = useFetch(`/api/hotels/room/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { dates: contextDates, options: contextOptions } = useContext(SearchContext);
  const storedDates = JSON.parse(localStorage.getItem("dates")) || [];
  const storedOptions = JSON.parse(localStorage.getItem("options")) || { adult: 1, children: 0, room: 1 };
  const [dates, setDates] = useState(contextDates.length ? contextDates : storedDates);
  const [options, setOptions] = useState(contextOptions.adult !== undefined ? contextOptions : storedOptions);

  const navigate = useNavigate();
  const datesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let dateList = [];
    const date = new Date(start.getTime());
    while (date <= end) {
      dateList.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dateList;
  };
  
  console.log(datesInRange(dates[0].startDate, dates[0].endDate));

  const bookedDates = datesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    console.log("Room Number:", roomNumber);
    console.log("Room Number Booked Dates:", roomNumber.bookedDates);
    console.log("HOTEL ID", hotelId);
    console.log("Booked Dates for Check:", bookedDates);
    const bookedRooms = roomNumber.bookedDates.some((date) =>
      bookedDates.includes(new Date(date).getTime())
    );
    console.log("Availability Check:", !bookedRooms);
    return !bookedRooms;
  };

  const handleCheck = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(checked ? [...selectedRooms, value] : selectedRooms.filter((room) => room !== value));
  }
  console.log(selectedRooms);

  const handleClick = async () => {
    try {
      await Promise.all(selectedRooms.map(room => {
        const res = axios.put(`/api/rooms/availability/${room}`, { dates: bookedDates });
        return res.data;
      }));
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="reservation">
      <div className="reservationContainer">
        <FontAwesomeIcon className="reservClose" icon={faXmarkCircle} onClick={() => setOpen(false)} />
        <span className="chooseRoomText">Choose your room :</span>
        {data.map(item => (
          <div className="roomItem">
            <div className="roomInfo">
              <div className="roomType">{item.roomType}</div>
              <div className="roomDesc">{item.description}</div>
              <div className="roomMaxPeop">Max {item.people} people.</div>
              <div className="roomPrice">{item.price} €</div>
            </div>

            {item.roomNumbers.map((roomNumber) => (
              <div className="room">
                <label>{roomNumber.number}</label>
                <input type="checkbox" value={roomNumber._id} onChange={handleCheck} disabled={!isAvailable(roomNumber)} />
              </div>
            ))}
          </div>
        ))}
        <button className="bookButtonModal" onClick={handleClick} >Reserve</button>
      </div>
    </div>
  )
}

export default Reservation
