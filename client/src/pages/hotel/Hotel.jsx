import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../../components/navbar/Navbar";
import "./Hotel.css";
import { faArrowLeft, faArrowRight, faLocation, faXmarkCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { SearchContext } from "../../context/SearchContext.jsx";
import { AuthenticationContext } from "../../context/AuthenticationContext.jsx";
import Reservation from "../../components/reservation/Reservation.jsx";
import axios from "axios";
import formatPrice from "../../utils/utils";
import MoreBookings from "../../components/moreBookings/MoreBookings";
import FlightComponent from "../../components/flightComponent/FlightComponent.jsx";
import { addProduct } from "../../redux/cartRedux.js";
import { useDispatch } from "react-redux";
const Hotel = () => {
  const [extraOptions, setExtraOptions] = useState({
    flight: false,
    attractions: false,
    taxi: false
  });
  const handleMoreBookingsConfirm = (selectedOptions) => {
    setExtraOptions(selectedOptions);
    console.log("Selected Options:", selectedOptions);
  };
  const [slideIndex, setSlideIndex] = useState(0);
  const [data, setData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openMoreBooking, setOpenMoreBooking] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [firstRoom, setFirstRoom] = useState(null);
  const [hotelDesc, setHotelDesc] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [ticketCounts, setTicketCounts] = useState({});
  const [openFlight, setOpenFlight] = useState(false);  // État pour ouvrir les vols
  console.log(ticketCounts);
  const [addedAttractions, setAddedAttractions] = useState([]); // Stocker les attractions ajoutées
  console.log("Added ATTRACTIONS", addedAttractions);
  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);
  const location = useLocation();
  const hotelId = location.pathname.split("/")[2];

  const { attractions } = location.state || {};
  const reviewScore = location.state?.reviewScore || "N/A";

  const { dates: contextDates, options: contextOptions } = useContext(SearchContext);
  const storedDates = JSON.parse(localStorage.getItem("dates")) || [];
  const storedOptions = JSON.parse(localStorage.getItem("options")) || { adult: 1, children: 0, room: 1 };

  const [dates] = useState(contextDates.length ? contextDates : storedDates);
  const [options] = useState(contextOptions.adult !== undefined ? contextOptions : storedOptions);
  const hotel = data?.data;
  const days = useMemo(() => {
    const mmsPerDay = 1000 * 60 * 60 * 24;
    const startDate = new Date(dates[0].startDate);
    const endDate = new Date(dates[0].endDate);
    if (!dates.length) return 0;
    const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return Math.floor((utc2 - utc1) / mmsPerDay);
  }, [dates]);

  const handleSlide = useCallback(
    (direction) => {
      setSlideIndex((prevIndex) =>
        direction === "left" ? (prevIndex === 0 ? photos.length - 1 : prevIndex - 1) : (prevIndex === photos.length - 1 ? 0 : prevIndex + 1)
      );
    },
    [photos.length]
  );

  const handleOpen = (index) => {
    setOpen(true);
    setSlideIndex(index);
  };

  const handleAttractionSelect = (index) => {
    setSelectedAttraction(index);
  };

  const handleAddAttraction = () => {
    const attraction = attractions[selectedAttraction];
    const attractionPrice = attraction.representativePrice.publicAmount;
    const ticketCount = ticketCounts[selectedAttraction] || 1;
    const updatedPrice = totalPrice + attractionPrice * ticketCount;

    setTotalPrice(updatedPrice);

    setAddedAttractions((prev) => [
      ...prev,
      { name: attraction.name, price: attractionPrice * ticketCount, index: selectedAttraction, ticketCount: ticketCount },
    ]);
  };

  const handleTicketCountChange = (e, index) => {
    const value = parseInt(e.target.value, 10);
    setTicketCounts((prevCounts) => ({
      ...prevCounts,
      [index]: value || 1,
    }));
  };



  const handleRemoveAttraction = (index) => {
    const attractionToRemove = addedAttractions.find(att => att.index === index);
    const updatedPrice = totalPrice - attractionToRemove.price;

    setTotalPrice(updatedPrice);

    setAddedAttractions((prev) => prev.filter(att => att.index !== index));
  };

  const handleClick = () => {
    if (user) {
      setOpenMoreBooking(true);
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  const dispatch = useDispatch();

  const handleCart = () => {
    if (!hotel || !totalPrice) {
      console.error("Missing information in cart");
      return;
    }

    dispatch(addProduct({
      product: data.data,
      attractions: addedAttractions || [],
      flights: extraOptions.flight || [] ,
      taxis: extraOptions.taxi || [],
      price: totalPrice
    }));

  };

  useEffect(() => {
    localStorage.setItem("dates", JSON.stringify(dates));
  }, [dates]);

  useEffect(() => {
    if (options.adult !== undefined && options.children !== undefined && options.room !== undefined) {
      localStorage.setItem("options", JSON.stringify(options));
    }
  }, [options]);

  const hotelDetails = useCallback(async () => {
    if (!dates.length || !dates[0].startDate || !dates[0].endDate) {
      console.error("Invalid dates:", dates);
      return;
    }

    const params = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails',
      params: {
        hotel_id: hotelId,
        arrival_date: format(new Date(dates[0].startDate), "yyyy-MM-dd"),
        departure_date: format(new Date(dates[0].endDate), "yyyy-MM-dd"),
      },
      headers: {
        'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };

    const hotelDescParams = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/getDescriptionAndInfo',
      params: {
        hotel_id: hotelId,
        languagecode: 'en-us'
      },
      headers: {
        'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };

    try {
      const [response, descResponse] = await Promise.all([
        axios.request(params),
        axios.request(hotelDescParams)
      ]);

      const rooms = response.data.data.rooms;
      const firstRoomKey = Object.keys(rooms)[0];
      const firstRoom = rooms[firstRoomKey];
      setFirstRoom(firstRoom);
      setPhotos(firstRoom.photos);
      setData(response.data);
      setHotelDesc(descResponse.data.data);

      const grossPrice = response.data.data?.composite_price_breakdown?.gross_amount_per_night?.value || 0;
      const charges = response.data.data?.composite_price_breakdown?.charges_details?.amount?.value || 0;
      const calculatedPrice = formatPrice((grossPrice * days * options.room) + charges);
      setTotalPrice(calculatedPrice);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    }
  }, [dates, options, hotelId]);

  useEffect(() => {
    if (dates.length > 0 && options.adult !== undefined && options.children !== undefined && options.room !== undefined) {
      hotelDetails();
    }
  }, [dates, options, hotelDetails]);

  return (
    <div>
      <Navbar />
      {!data ? (
        "Loading..."
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="photoSlider">
              <FontAwesomeIcon icon={faXmarkCircle} className="closeIcon" onClick={() => setOpen(false)} />
              <FontAwesomeIcon icon={faArrowLeft} className="leftIcon" onClick={() => handleSlide("left")} />
              <div className="photoSliderWrapper">
                {photos.length > 0 && (
                  <img src={photos[slideIndex].url_max1280} alt="" className="photoSliderImage" />
                )}
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="rightIcon" onClick={() => handleSlide("right")} />
            </div>
          )}
          <div className="hotelWrapper">
            <button className="bookButtonUp" onClick={handleClick}>Book Now</button>
            <h1 className="hotelName">{data.data?.hotel_name}</h1>
            <div className="hotelLocation">
              <FontAwesomeIcon icon={faLocation} className="hotelLocationIcon" />
              <span>{data.data?.address}, {data.data?.zip} {data.data?.city}, {data.data?.country_trans}</span>
            </div>
            <div className="hotelWebsite">
              <a href={data.data?.url} target="_blank" rel="noreferrer">Visit website</a>
            </div>

            <span className="hotelDist">{Math.floor(data.data?.distance_to_cc)} m from city center</span>
            <span className="hotelHighlight">Book early and get a free airport transport</span>
            <div className="hotelImages">
              {photos.map((image, index) => (
                <div className="hotelImagesWrapper" key={index}>
                  <img onClick={() => handleOpen(index)} src={image.url_original} alt={`Hotel image ${index + 1}`} className="hotelImage" />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDesc">
                <div className="hotelDescText">
                  <h2 className="hotelDescTitle">About {data.data?.hotel_name}</h2>
                  <p className="hotelDescInfo">{hotelDesc.map(
                    (desc, index) => (
                      <span key={index}>{desc.description}</span>
                    )
                  )}</p>
                  <h3 className="roomsDescTitle">Rooms description:</h3>
                  <p className="roomsDesc">{firstRoom.description}</p>
                </div>
                <div>
                  <h2 className="hotelFacility">Facilities</h2>
                  <ul className="hotelDescList">
                    {data.data?.property_highlight_strip.map((facility, index) => (
                      <li key={index} className="hotelDescListItem">{facility.name}</li>
                    ))}
                  </ul>
                </div>

                <div className="moreBookingFlight">
                  <FlightComponent />
                </div>

                <div className="moreBookingTaxi">

                </div>

                <div className="nearbyAttractions">
                  <h2 className="hotelAttractions">Nearby Attractions</h2>
                  {attractions?.length > 0 ? (
                    <ul className="hotelAttractionsList">
                      {attractions.map((attraction, index) => {
                        const ticketCount = ticketCounts[index] || 1;  // Nombre de tickets sélectionnés ou 1 par défaut
                        const totalPrice = attraction.representativePrice.publicAmount * ticketCount;

                        return (
                          <li
                            key={index}
                            className={`hotelAttractionsListItem ${selectedAttraction === index ? 'selectedAttraction' : ''}`}
                            onClick={() => handleAttractionSelect(index)}
                          >
                            <img src={attraction.primaryPhoto.small} alt="attraction" className="attractionImage" />
                            <div className="attractionDetails">
                              <div className="attractionName">{attraction.name}</div>
                              <div className="attractionDescription">{attraction.shortDescription}</div>
                              <div className="attractionPrice">{totalPrice}€</div> {/* Prix total */}

                              {selectedAttraction === index && (
                                <div className="ticketSelection">
                                  <label htmlFor={`ticketCount-${index}`}>Number of Tickets:</label>
                                  <input
                                    type="number"
                                    id={`ticketCount-${index}`}
                                    value={ticketCount}
                                    min="1"
                                    onChange={(e) => handleTicketCountChange(e, index)}
                                  />
                                  <button onClick={handleAddAttraction}>Add to Booking</button>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="noAttractionsMessage">Sorry, No nearby attractions found.</p>
                  )}
                </div>

              </div>
              <div className="hotelDescPrice">
                <div className="hotelDescPriceWrapper">
                  <h1>Perfect for a {days} night stay</h1>
                  <span>Highly rated by travelers: <strong>{reviewScore}</strong></span>
                  {/* Afficher les attractions ajoutées ici */}
                  {addedAttractions.length > 0 && (
                    <div className="addedAttractions">
                      <h3>Added Attractions:</h3>
                      <ul>
                        {addedAttractions.map((attraction, index) => (
                          <li key={index} className="addedAttractionItem">
                            <span>{ticketCounts[attraction.index]} x {attraction.name} - {Math.ceil(attraction.price)}€ </span>
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="removeAttractionIcon"
                              onClick={() => handleRemoveAttraction(attraction.index)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <span className="hotelDescPriceAmount">
                    {totalPrice ? `${Math.floor(totalPrice)}€ (${days} Nights)` : "Price not available"}
                  </span>
                  <button onClick={handleClick} className="hotelDescPriceBook">Book now</button>
                  <button onClick={handleCart} className="hotelDescPriceBook">Add to cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {openPayment && <Reservation
        setOpen={setOpenPayment}
        hotelId={hotelId}
        hotel={hotel}
        nbRooms={options.room}
        extraOptions={extraOptions}
        addedAttractions={addedAttractions}
        attractionPrice={totalPrice}
      />}
      {openMoreBooking && <MoreBookings setOpen={setOpenMoreBooking} setOpenPayment={setOpenPayment} onConfirm={handleMoreBookingsConfirm} />}
    </div>
  );
}

export default Hotel;
