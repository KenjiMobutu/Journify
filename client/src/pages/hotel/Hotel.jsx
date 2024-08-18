import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./Hotel.css";
import { faArrowLeft, faArrowRight, faLocation, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import Newsletter from "../../components/newsletter/Newsletter";
import Footer from "../../components/footer/FooterPage";
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { SearchContext } from "../../context/SearchContext.jsx";
import { AuthenticationContext } from "../../context/AuthenticationContext.jsx";
import Reservation from "../../components/reservation/Reservation.jsx";
import axios from "axios";
import formatPrice from "../../utils/utils";

const Hotel = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [data, setData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);
  const location = useLocation();
  const hotelId = location.pathname.split("/")[2];

  // Récupérer les dates et options du contexte ou de localStorage
  const { dates: contextDates, options: contextOptions } = useContext(SearchContext);
  const storedDates = JSON.parse(localStorage.getItem("dates")) || [];
  const storedOptions = JSON.parse(localStorage.getItem("options")) || { adult: 1, children: 0, room: 1 };

  const [dates, setDates] = useState(contextDates.length ? contextDates : storedDates);
  const [options, setOptions] = useState(contextOptions.adult !== undefined ? contextOptions : storedOptions);

  console.log("Options après récupération:", options);

  useEffect(() => {
    // Sauvegarde des dates et options dans le localStorage
    if (dates.length > 0) {
      localStorage.setItem("dates", JSON.stringify(dates));
    }
    if (options.adult !== undefined && options.children !== undefined && options.room !== undefined) {
      localStorage.setItem("options", JSON.stringify(options));
    }
  }, [dates, options]);

  const mmsPerDay = 1000 * 60 * 60 * 24;
  function dateDiffInDays(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / mmsPerDay);
  }

  const days = dates.length > 0 ? dateDiffInDays(new Date(dates[0].startDate), new Date(dates[0].endDate)) : 0;

  const handleSlide = (direction) => {
    setSlideIndex(direction === "left" ? (slideIndex === 0 ? 5 : slideIndex - 1) : (slideIndex === 5 ? 0 : slideIndex + 1));
  };

  const handleOpen = (index) => {
    setOpen(true);
    setSlideIndex(index);
  };

  const handleClick = () => {
    if (user) {
      setOpenPayment(true);
    } else {
      navigate("/login");
    }
  };

  const hotelDetails = async () => {
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

    try {
      const response = await axios.request(params);
      console.log("Response Data:", response.data);
      setData(response.data);

      const grossPrice = response.data.data?.composite_price_breakdown?.gross_amount_per_night?.value || 0;
      const charges = response.data.data?.composite_price_breakdown?.charges_details?.amount?.value || 0;
      const calculatedPrice = formatPrice((grossPrice * days * options.room) + charges);
      console.log("Gross Price:", grossPrice);
      console.log("Charges:", charges);
      console.log("Options:", options.room);

      console.log("Calculated Price:", calculatedPrice);
      setTotalPrice(calculatedPrice);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    }
  };

  useEffect(() => {
    if (dates.length > 0 && options.adult !== undefined && options.children !== undefined && options.room !== undefined) {
      hotelDetails();
    }
  }, [dates, options]);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {!data ? (
        "Loading..."
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="photoSlider">
              <FontAwesomeIcon icon={faXmarkCircle} className="closeIcon" onClick={() => setOpen(false)} />
              <FontAwesomeIcon icon={faArrowLeft} className="leftIcon" onClick={() => handleSlide("left")} />
              <div className="photoSliderWrapper">
                {data.photos && data.photos[slideIndex] && (
                  <img src={data.photos[slideIndex]} alt="" className="photoSliderImage" />
                )}
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="rightIcon" onClick={() => handleSlide("right")} />
            </div>
          )}
          <div className="hotelWrapper">
            <button className="bookButton">Book Now</button>
            <h1 className="hotelName">{data.data?.hotel_name}</h1>
            <div className="hotelLocation">
              <FontAwesomeIcon icon={faLocation} className="hotelLocationIcon" />
              <span>{data.data?.address}, {data.data?.zip} {data.data?.city}</span>
            </div>
            <div className="hotelWebsite">
              <a href={data.data?.url} target="_blank" rel="noreferrer">Visit website</a>
            </div>

            <span className="hotelDist">{Math.floor(data.data?.distance_to_cc)}m from city center</span>
            <span className="hotelHighlight">Book early and get a free airport transport</span>
            <div className="hotelImages">
              {data.photos?.map((image, index) => (
                <div className="hotelImagesWrapper" key={index}>
                  <img onClick={() => handleOpen(index)} src={image.src} alt={`Hotel image ${index + 1}`} className="hotelImage" />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDesc">
                <div className="hotelDescText">
                  <h2 className="hotelDescTitle">About {data.data?.hotel_name}</h2>
                  <p className="hotelDescInfo">
                    {data.data?.description}
                  </p>
                </div>
              </div>
              <div className="hotelDescPrice">
                <div className="hotelDescPriceWrapper">
                  <h1>Perfect for a {days} night stay</h1>
                  <span>Good location: highly rated by recent travelers {data.data?.breakfast_review_score?.rating}</span>
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
      {openPayment && <Reservation setOpen={setOpenPayment} hotelId={hotelId} />}
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Hotel;
