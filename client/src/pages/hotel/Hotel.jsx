// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Header from "../../components/header/Header";
// import Navbar from "../../components/navbar/Navbar";
// import "./Hotel.css";
// import { faArrowLeft, faArrowRight, faLocation, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
// import Newsletter from "../../components/newsletter/Newsletter";
// import Footer from "../../components/footer/FooterPage";
// import { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { format } from "date-fns";
// import { SearchContext } from "../../context/SearchContext.jsx";
// import { AuthenticationContext } from "../../context/AuthenticationContext.jsx";
// import Reservation from "../../components/reservation/Reservation.jsx";
// import axios from "axios";
// import formatPrice from "../../utils/utils";
// import MoreBookings from "../../components/moreBookings/MoreBookings";

// const Hotel = () => {
//   const [slideIndex, setSlideIndex] = useState(0);
//   const [data, setData] = useState(null);
//   const [totalPrice, setTotalPrice] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [openPayment, setOpenPayment] = useState(false);
//   // const [openFlight, setOpenFlight] = useState(false);
//   // const [openTaxi, setOpenTaxi] = useState(false);
//   const [openMoreBooking, setOpenMoreBooking] = useState(false);
//   const [photos, setPhotos] = useState([]);
//   const [firstRoom, setFirstRoom] = useState(null);
//   const [hotelDesc, setHotelDesc] = useState([]);

//   const navigate = useNavigate();
//   const { user } = useContext(AuthenticationContext);
//   const location = useLocation();
//   const hotelId = location.pathname.split("/")[2];

//   const { attractions } = location.state || {};
//   console.log("Attraction:", attractions);
//   // Récupérer le reviewScore depuis l'état passé dans le Link
//   const reviewScore = location.state?.reviewScore || "N/A";
//   console.log("Review Score:", reviewScore);

//   const hotel = data?.data;
//   console.log("Hotel:", hotel);

//   // Récupérer les dates et options du contexte ou de localStorage
//   const { dates: contextDates, options: contextOptions } = useContext(SearchContext);
//   const storedDates = JSON.parse(localStorage.getItem("dates")) || [];
//   const storedOptions = JSON.parse(localStorage.getItem("options")) || { adult: 1, children: 0, room: 1 };

//   const [dates, setDates] = useState(contextDates.length ? contextDates : storedDates);
//   const [options, setOptions] = useState(contextOptions.adult !== undefined ? contextOptions : storedOptions);
//   console.log(options);

//   useEffect(() => {
//     if (dates.length > 0) {
//       localStorage.setItem("dates", JSON.stringify(dates));
//     }
//     if (options.adult !== undefined && options.children !== undefined && options.room !== undefined) {
//       localStorage.setItem("options", JSON.stringify(options));
//     }
//   }, [dates, options]);

//   const mmsPerDay = 1000 * 60 * 60 * 24;
//   function dateDiffInDays(a, b) {
//     const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
//     const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
//     return Math.floor((utc2 - utc1) / mmsPerDay);
//   }

//   const days = dates.length > 0 ? dateDiffInDays(new Date(dates[0].startDate), new Date(dates[0].endDate)) : 0;

//   const handleSlide = (direction) => {
//     setSlideIndex(direction === "left" ? (slideIndex === 0 ? photos.length - 1 : slideIndex - 1) : (slideIndex === photos.length - 1 ? 0 : slideIndex + 1));
//   };

//   const handleOpen = (index) => {
//     setOpen(true);
//     setSlideIndex(index);
//   };

//   const handleClick = () => {
//     if (user) {
//       // Afficher une boîte de dialogue demandant si l'utilisateur souhaite réserver un vol ou un taxi
//       setOpenMoreBooking(true);
//     } else {
//       // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
//       navigate("/login", { state: { from: location.pathname } });
//     }
//   };


//   const hotelDetails = async () => {
//     if (!dates.length || !dates[0].startDate || !dates[0].endDate) {
//       console.error("Invalid dates:", dates);
//       return;
//     }

//     const params = {
//       method: 'GET',
//       url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails',
//       params: {
//         hotel_id: hotelId,
//         arrival_date: format(new Date(dates[0].startDate), "yyyy-MM-dd"),
//         departure_date: format(new Date(dates[0].endDate), "yyyy-MM-dd"),
//       },
//       headers: {
//         'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
//         'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
//       },
//     };

//     const hotelDesc = {
//       method: 'GET',
//       url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/getDescriptionAndInfo',
//       params: {
//         hotel_id: hotelId,
//         languagecode: 'en-us'
//       },
//       headers: {
//         'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
//         'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
//       },
//     };

//     try {
//       const response = await axios.request(params);
//       console.log("Hotel details:", response.data);

//       const descResponse = await axios.request(hotelDesc);
//       console.log("Hotel description:", descResponse);

//       const rooms = response.data.data.rooms;
//       const firstRoomKey = Object.keys(rooms)[0];
//       const firstRoom = rooms[firstRoomKey];
//       console.log(firstRoom);
//       setFirstRoom(firstRoom);
//       setPhotos(firstRoom.photos);
//       setData(response.data);
//       setHotelDesc(descResponse.data.data);

//       const grossPrice = response.data.data?.composite_price_breakdown?.gross_amount_per_night?.value || 0;
//       const charges = response.data.data?.composite_price_breakdown?.charges_details?.amount?.value || 0;
//       const calculatedPrice = formatPrice((grossPrice * days * options.room) + charges);
//       setTotalPrice(calculatedPrice);
//     } catch (error) {
//       console.error("Error fetching hotel details:", error);
//     }
//   };

//   useEffect(() => {
//     if (dates.length > 0 && options.adult !== undefined && options.children !== undefined && options.room !== undefined) {
//       hotelDetails();
//     }
//   }, [dates, options]);

//   return (
//     <div>
//       <Navbar />
//       {/* <Header type="list" /> */}
//       {!data ? (
//         "Loading..."
//       ) : (
//         <div className="hotelContainer">
//           {open && (
//             <div className="photoSlider">
//               <FontAwesomeIcon icon={faXmarkCircle} className="closeIcon" onClick={() => setOpen(false)} />
//               <FontAwesomeIcon icon={faArrowLeft} className="leftIcon" onClick={() => handleSlide("left")} />
//               <div className="photoSliderWrapper">
//                 {photos.length > 0 && (
//                   <img src={photos[slideIndex].url_max1280} alt="" className="photoSliderImage" />
//                 )}
//               </div>
//               <FontAwesomeIcon icon={faArrowRight} className="rightIcon" onClick={() => handleSlide("right")} />
//             </div>
//           )}
//           <div className="hotelWrapper">
//             <button className="bookButtonUp" onClick={handleClick}>Book Now</button>
//             <h1 className="hotelName">{data.data?.hotel_name}</h1>
//             <div className="hotelLocation">
//               <FontAwesomeIcon icon={faLocation} className="hotelLocationIcon" />
//               <span>{data.data?.address}, {data.data?.zip} {data.data?.city}, {data.data?.country_trans}</span>
//             </div>
//             <div className="hotelWebsite">
//               <a href={data.data?.url} target="_blank" rel="noreferrer">Visit website</a>
//             </div>

//             <span className="hotelDist">{Math.floor(data.data?.distance_to_cc)}m from city center</span>
//             <span className="hotelHighlight">Book early and get a free airport transport</span>
//             <div className="hotelImages">
//               {photos.map((image, index) => (
//                 <div className="hotelImagesWrapper" key={index}>
//                   <img onClick={() => handleOpen(index)} src={image.url_original} alt={`Hotel image ${index + 1}`} className="hotelImage" />
//                 </div>
//               ))}
//             </div>
//             <div className="hotelDetails">
//               <div className="hotelDesc">
//                 <div className="hotelDescText">
//                   <h2 className="hotelDescTitle">About {data.data?.hotel_name}</h2>
//                   <p className="hotelDescInfo">{hotelDesc.map(
//                     (desc, index) => (
//                       <span key={index}>{desc.description}</span>
//                     )
//                   )}</p>
//                   <h3 className="roomsDescTitle">Rooms description:</h3>
//                   <p className="roomsDesc">{firstRoom.description}</p>

//                 </div>
//                 <div>
//                   <h2 className="hotelFacility">Facilities</h2>
//                   <ul className="hotelDescList">
//                     {data.data?.property_highlight_strip.map((facility, index) => (
//                       <li key={index} className="hotelDescListItem">{facility.name}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="nearbyAttractions">
//                   <h2 className="hotelAttractions">Nearby Attractions</h2>
//                   <ul className="hotelAttractionsList">
//                     {attractions?.map((attraction, index) => (
//                       <li key={index} className="hotelAttractionsListItem">
//                         <img src={attraction.primaryPhoto.small} alt="attraction" className="attractionImage" />
//                         <div className="attractionDetails">
//                           <div className="attractionName">{attraction.name}</div>
//                           <div className="attractionDescription">{attraction.shortDescription}</div>
//                           <div className="attractionPrice">{attraction.representativePrice.publicAmount}€</div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>


//               </div>
//               <div className="hotelDescPrice">
//                 <div className="hotelDescPriceWrapper">
//                   <h1>Perfect for a {days} night stay</h1>
//                   {/* Utiliser le reviewScore transmis */}
//                   <span>Highly rated by travelers: <strong>{reviewScore}</strong></span>
//                   <span className="hotelDescPriceAmount">
//                     {totalPrice ? `${totalPrice}€ (${days} Nights)` : "Price not available"}
//                   </span>
//                   <button onClick={handleClick} className="hotelDescPriceBook">Book now</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {openPayment && <Reservation setOpen={setOpenPayment} hotelId={hotelId} hotel={hotel} nbRooms={options.room} />}
//       {openMoreBooking && <MoreBookings setOpen={setOpenMoreBooking} setOpenPayment={setOpenPayment} />}
//       {/* <Newsletter /> */}
//       {/* <Footer /> */}
//     </div>
//   );
// }

// export default Hotel;





import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./Hotel.css";
import { faArrowLeft, faArrowRight, faLocation, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import Newsletter from "../../components/newsletter/Newsletter";
import Footer from "../../components/footer/FooterPage";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { SearchContext } from "../../context/SearchContext.jsx";
import { AuthenticationContext } from "../../context/AuthenticationContext.jsx";
import Reservation from "../../components/reservation/Reservation.jsx";
import axios from "axios";
import formatPrice from "../../utils/utils";
import MoreBookings from "../../components/moreBookings/MoreBookings";

const Hotel = () => {
  const [extraOptions, setExtraOptions] = useState({
    flight: false,
    attractions: false,
    taxi: false
  });
  const handleMoreBookingsConfirm = (selectedOptions) => {
    setExtraOptions(selectedOptions);
    console.log("Selected Options:", selectedOptions);
    //setOpenPayment(true);
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
  const [ticketCount, setTicketCount] = useState(1);

  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);
  const location = useLocation();
  const hotelId = location.pathname.split("/")[2];

  const { attractions } = location.state || {};
  const reviewScore = location.state?.reviewScore || "N/A";

  const { dates: contextDates, options: contextOptions } = useContext(SearchContext);
  const storedDates = JSON.parse(localStorage.getItem("dates")) || [];
  const storedOptions = JSON.parse(localStorage.getItem("options")) || { adult: 1, children: 0, room: 1 };

  const [dates, setDates] = useState(contextDates.length ? contextDates : storedDates);
  const [options, setOptions] = useState(contextOptions.adult !== undefined ? contextOptions : storedOptions);
  console.log(dates);
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
    const attractionPrice = attractions[selectedAttraction].representativePrice.publicAmount;
    const updatedPrice = totalPrice + attractionPrice * ticketCount;
    setTotalPrice(updatedPrice);
  };

  const handleTicketCountChange = (e) => {
    setTicketCount(e.target.value);
  };

  const handleClick = () => {
    if (user) {
      setOpenMoreBooking(true);
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
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

                </div>

                <div className="moreBookingTaxi">

                </div>

                <div className="nearbyAttractions">
                  <h2 className="hotelAttractions">Nearby Attractions</h2>
                  {attractions?.length > 0 ? (
                    <ul className="hotelAttractionsList">
                      {attractions.map((attraction, index) => (
                        <li key={index} className="hotelAttractionsListItem">
                          <img src={attraction.primaryPhoto.small} alt="attraction" className="attractionImage" />
                          <div className="attractionDetails">
                            <div className="attractionName">{attraction.name}</div>
                            <div className="attractionDescription">{attraction.shortDescription}</div>
                            <div className="attractionPrice">{attraction.representativePrice.publicAmount}€</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="noAttractionsMessage">Sorry, No nearby attractions found.</p>
                  )}
                  {selectedAttraction !== null && (
                    <div className="ticketSelection">
                      <label htmlFor="ticketCount">Number of Tickets:</label>
                      <input
                        type="number"
                        id="ticketCount"
                        value={ticketCount}
                        min="1"
                        onChange={handleTicketCountChange}
                      />
                      <button onClick={handleAddAttraction}>Add to Booking</button>
                    </div>
                  )}
                </div>

              </div>
              <div className="hotelDescPrice">
                <div className="hotelDescPriceWrapper">
                  <h1>Perfect for a {days} night stay</h1>
                  <span>Highly rated by travelers: <strong>{reviewScore}</strong></span>
                  <span className="hotelDescPriceAmount">
                    {totalPrice ? `${totalPrice}€ (${days} Nights)` : "Price not available"}
                  </span>
                  <button onClick={handleClick} className="hotelDescPriceBook">Book now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {openPayment && <Reservation setOpen={setOpenPayment} hotelId={hotelId} hotel={hotel} nbRooms={options.room} extraOptions={extraOptions} />}
      {openMoreBooking && <MoreBookings setOpen={setOpenMoreBooking} setOpenPayment={setOpenPayment} onConfirm={handleMoreBookingsConfirm} />}
    </div>
  );
}

export default Hotel;
