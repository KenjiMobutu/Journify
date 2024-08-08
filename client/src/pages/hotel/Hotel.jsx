import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Header from "../../components/header/Header"
import Navbar from "../../components/navbar/Navbar"
import "./Hotel.css"
import { faArrowLeft, faArrowRight, faLocation, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import Newsletter from "../../components/newsletter/Newsletter"
import Footer from "../../components/footer/FooterPage"
import { useState } from "react"

const Hotel = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const handleSlide = (direction)=>{
    if(direction === "left"){
      if(slideIndex === 0){
        setSlideIndex(5);
      } else {
        setSlideIndex(slideIndex - 1);
      }
    } else {
      if(slideIndex === 5){
        setSlideIndex(0);
      } else {
        setSlideIndex(slideIndex + 1);
      }
    }
  };
  const [open, setOpen] = useState(false);
  const handleOpen = (index)=>{
    setOpen(true);
    setSlideIndex(index);
  };

  const images = [
    {src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/294801591.jpg?k=09ea08740209344847f69183b9569a8b096a356f352a145458e703371c040dae&o=&hp=1", alt: "hotel"},
    {src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/294803038.jpg?k=0e4b1b6d41cf16757565b369e710d569a1bb08cac509e86769e74bb85b3af2a3&o=&hp=1", alt: "hotel"},
    {src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/294804016.jpg?k=2075952d0673cdb24f3d32189b7859f86a17121b229b031f2e3cad9631995753&o=&hp=1", alt: "hotel"},
    {src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/294802795.jpg?k=8e9365e361a6bd737ec630275473cefd0cae980797acf9286ea8b2b342e74bb3&o=&hp=1", alt: "hotel"},
    {src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/23187912.jpg?k=c4ecb38c747c7d66dfb236afa836cce2e9914ab03dcfbd9fd72b335256c887dc&o=&hp=1", alt: "hotel"},
    {src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/294812148.jpg?k=1be3a14efb81a9d7626861cab162694b22b58235d934ec00dfcebea4e162e5f5&o=&hp=1", alt: "hotel"},
  ];

  return (
    <div>
      <Navbar/>
      <Header type="list"/>
      <div className="hotelContainer">
        {open && <div className="photoSlider">
          <FontAwesomeIcon icon={faXmarkCircle} className="closeIcon" onClick={()=>setOpen(false)}/>
          <FontAwesomeIcon icon={faArrowLeft} className="leftIcon" onClick={()=>handleSlide("left")}/>
          <div className="photoSliderWrapper">
                <img src={images[slideIndex].src} alt="" className="photoSliderImage"/>
          </div>
          <FontAwesomeIcon icon={faArrowRight} className="rightIcon" onClick={()=>handleSlide("right")}/>
        </div>}
        <div className="hotelWrapper">
          <button className="bookButton">Book Now</button>
          <h1 className="hotelName">Hotel Riu Palace</h1>
          <div className="hotelLocation">
            <FontAwesomeIcon icon={faLocation} className="hotelLocationIcon"/>
            <span>534 Calle Juan Carlos Spain</span>
          </div>
          <span className="hotelDist"> 350 from beach</span>
          <span className="hotelHighlight">Book early and get a free airport transport</span>
          <div className="hotelImages">
            {images.map((image, index) => (
              <div className="hotelImagesWrapper" key={index}>
                <img onClick={()=>handleOpen(index)} src={image.src} alt={`Hotel image ${index + 1}`} className="hotelImage" />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDesc">
              <div className="hotelDescText">
                <h2 className="hotelDescTitle">About this hotel</h2>
                <p className="hotelDescInfo">Located in the heart of the city,
                  Hotel Riu Palace offers the best view of the city and the beach.
                  The hotel offers a variety of services and amenities to make your
                  stay as comfortable as possible.
                </p>
              </div>
            </div>
            <div className="hotelDescPrice">
              <div className="hotelDescPriceWrapper">
                <h1>Perfect for a 4 night stay</h1>
                <span>Good location: highly rated by recent travelers (9.5)</span>
                <span className="hotelDescPriceAmount">480€ (4 Nights)</span>
                <button className="hotelDescPriceBook">Book now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Newsletter/>
      <Footer/>
    </div>
  )
}

export default Hotel
