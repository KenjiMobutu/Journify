import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./reservation.css";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../context/SearchContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function Reservation({ setOpen, hotelId, hotel }) {
  const { dates: contextDates, options: contextOptions } = useContext(SearchContext);
  const storedDates = JSON.parse(localStorage.getItem("dates")) || [];
  const storedOptions = JSON.parse(localStorage.getItem("options")) || { adult: 1, children: 0, room: 1 };
  const [dates, setDates] = useState(contextDates.length ? contextDates : storedDates);
  const [options, setOptions] = useState(contextOptions.adult !== undefined ? contextOptions : storedOptions);
  const [availableRooms, setAvailableRooms] = useState([]); // Initialize with an empty array
  const [selectedRooms, setSelectedRooms] = useState([]); // State to manage selected rooms
  const [totalPrice, setTotalPrice] = useState(0); // State to manage total price

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
      setAvailableRooms(response.data.available || []); // Set to an empty array if undefined
    } catch (error) {
      console.error("Error fetching room availability:", error);
    }
  };

  useEffect(() => {
    availability();
  }, [dates, options, hotelId]);

  const handleRoomClick = (roomId, roomPrice) => {
    setSelectedRooms(prevSelectedRooms => {
      let newSelectedRooms;
      let newTotalPrice = totalPrice;

      if (prevSelectedRooms.includes(roomId)) {
        newSelectedRooms = prevSelectedRooms.filter(id => id !== roomId); // Remove room from selection if already selected
        newTotalPrice -= roomPrice; // Subtract price when room is deselected
      } else {
        newSelectedRooms = [...prevSelectedRooms, roomId]; // Add room to selection if not selected
        newTotalPrice += roomPrice; // Add price when room is selected
      }

      setTotalPrice(newTotalPrice);
      return newSelectedRooms;
    });
  };

  const handleClick = () => {
    // Logic to handle reservation with selected rooms
    const queryParams = new URLSearchParams({
      startDate: dates[0].startDate,
      endDate: dates[0].endDate,
      adults: options.adult,
      children: options.children,
      rooms: options.room,
      hotel: JSON.stringify(hotel),
      price: totalPrice,
    }).toString();

    setOpen(false);
    navigate(`/hotels/${hotelId}/booking?${queryParams}`);
  };

  return (
    <div className="reservation">
      <div className="reservationContainer">
        <FontAwesomeIcon className="reservClose" icon={faXmarkCircle} onClick={() => setOpen(false)} />
        <span className="chooseRoomText">Choose your room :</span>
        <div className="totalPrice">
          <span>Total Price: {totalPrice}€</span>
        </div>
        {availableRooms.length > 0 ? (
          availableRooms.map(item => (
            <div
              className={`roomItem ${selectedRooms.includes(item.block_id) ? 'selected' : ''}`}
              key={item.block_id}
              onClick={() => handleRoomClick(item.block_id, Math.round(item.product_price_breakdown.all_inclusive_amount.value))}
            >
              <div className="roomInfo">
                <div className="roomType">{item.name_without_policy}</div>
                <div className="roomPrice">{Math.round(item.product_price_breakdown.all_inclusive_amount.value)}€</div>
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
