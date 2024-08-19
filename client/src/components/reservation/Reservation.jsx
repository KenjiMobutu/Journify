import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./reservation.css";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../context/SearchContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function Reservation({ setOpen, hotelId }) {
  const { dates: contextDates, options: contextOptions } = useContext(SearchContext);
  const storedDates = JSON.parse(localStorage.getItem("dates")) || [];
  const storedOptions = JSON.parse(localStorage.getItem("options")) || { adult: 1, children: 0, room: 1 };
  const [dates, setDates] = useState(contextDates.length ? contextDates : storedDates);
  const [options, setOptions] = useState(contextOptions.adult !== undefined ? contextOptions : storedOptions);
  const [availableRooms, setAvailableRooms] = useState([]); // Initialize with an empty array
  const [selectedRooms, setSelectedRooms] = useState([]); // State to manage selected rooms

  const navigate = useNavigate();

  const availability = async () => {
    const params = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/getRoomListWithAvailability',
      params: {
        hotel_id: hotelId,
        currency_code: 'USD',
        arrival_date: format(new Date(dates[0].startDate), "yyyy-MM-dd"),
        departure_date: format(new Date(dates[0].endDate), "yyyy-MM-dd"),
        room_qty: options.room,
        adults: options.adult,
        units: 'metric',
        temperature_unit: 'c',
      },
      headers: {
        'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(params);
      console.log("Room response:", response.data);
      setAvailableRooms(response.data.available || []); // Set to an empty array if undefined
    } catch (error) {
      console.error("Error fetching room availability:", error);
    }
  };

  useEffect(() => {
    availability();
  }, [dates, options, hotelId]);

  const handleRoomClick = (roomId) => {
    console.log("Room clicked:", roomId);
    setSelectedRooms(prevSelectedRooms => {
      if (prevSelectedRooms.includes(roomId)) {
        return prevSelectedRooms.filter(id => id !== roomId); // Remove room from selection if already selected
      } else {
        return [...prevSelectedRooms, roomId]; // Add room to selection if not selected
      }
    });
  };

  const handleClick = () => {
    // Logic to handle reservation with selected rooms
    console.log("Selected rooms:", selectedRooms);
    // Add your logic to proceed with the reservation using selectedRooms
    setOpen(false);
    //navigate("/");
  };

  return (
    <div className="reservation">
      <div className="reservationContainer">
        <FontAwesomeIcon className="reservClose" icon={faXmarkCircle} onClick={() => setOpen(false)} />
        <span className="chooseRoomText">Choose your room :</span>
        {availableRooms.length > 0 ? (
          availableRooms.map(item => (
            <div
              className={`roomItem ${selectedRooms.includes(item.block_id) ? 'selected' : ''}`}
              key={item.block_id}
              onClick={() => handleRoomClick(item.block_id)}
            >
              <div className="roomInfo">
                <div className="roomType">{item.name_without_policy}</div>
                <div className="roomPrice">{item.product_price_breakdown.all_inclusive_amount.value}€</div>
              </div>
            </div>
          ))
        ) : (
          <p>No rooms available for the selected dates.</p>
        )}
        <button className="bookButtonModal" onClick={handleClick}>Reserve</button>
      </div>
    </div>
  );
}

export default Reservation;
