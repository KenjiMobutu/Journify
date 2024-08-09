import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Header from "../../components/header/Header"
import Navbar from "../../components/navbar/Navbar"
import "./Hotel.css"
import { faArrowLeft, faArrowRight, faLocation, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import Newsletter from "../../components/newsletter/Newsletter"
import Footer from "../../components/footer/FooterPage"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import useFetch from "../../hooks/useFetch"
import { useContext } from "react"
import { SearchContext } from "../../context/SearchContext.jsx"

const Hotel = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const handleSlide = (direction) => {
    if (direction === "left") {
      if (slideIndex === 0) {
        setSlideIndex(5);
      } else {
        setSlideIndex(slideIndex - 1);
      }
    } else {
      if (slideIndex === 5) {
        setSlideIndex(0);
      } else {
        setSlideIndex(slideIndex + 1);
      }
    }
  };
  const [open, setOpen] = useState(false);
  const handleOpen = (index) => {
    setOpen(true);
    setSlideIndex(index);
  };
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  console.log(id);

  // eslint-disable-next-line
  const { data, loading, error } = useFetch(`/api/hotels/find/${id}`);
  console.log(data);

  const { dates, options } = useContext(SearchContext);
  console.log(dates);

  const mmsPerDay = 1000 * 60 * 60 * 24;
  function dateDiffInDays(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / mmsPerDay);
  }
  const days = (dateDiffInDays(dates[0].startDate, dates[0].endDate));


  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        "Loading..."
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="photoSlider">
              <FontAwesomeIcon icon={faXmarkCircle} className="closeIcon" onClick={() => setOpen(false)} />
              <FontAwesomeIcon icon={faArrowLeft} className="leftIcon" onClick={() => handleSlide("left")} />
              <div className="photoSliderWrapper">
                <img src={data.photos[slideIndex]} alt="" className="photoSliderImage" />
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="rightIcon" onClick={() => handleSlide("right")} />
            </div>
          )}
          <div className="hotelWrapper">
            <button className="bookButton">Book Now</button>
            <h1 className="hotelName">{data?.name}</h1>
            <div className="hotelLocation">
              <FontAwesomeIcon icon={faLocation} className="hotelLocationIcon" />
              <span>{data?.address}</span>
            </div>
            <span className="hotelDist">{data?.distance}m from beach</span>
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
                  <h2 className="hotelDescTitle">About {data.name}</h2>
                  <p className="hotelDescInfo">
                    {data.description}
                  </p>
                </div>
              </div>
              <div className="hotelDescPrice">
                <div className="hotelDescPriceWrapper">
                  <h1>Perfect for a {days} night stay</h1>
                  <span>Good location: highly rated by recent travelers (9.5)</span>
                  <span className="hotelDescPriceAmount">{data.price * days * options.room}€ ({days} Nights)</span>
                  <button className="hotelDescPriceBook">Book now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Hotel
