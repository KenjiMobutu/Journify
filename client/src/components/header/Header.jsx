import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { faEarthAfrica } from '@fortawesome/free-solid-svg-icons';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faIcons } from '@fortawesome/free-solid-svg-icons';
import { faTaxi } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import "./header.css";
import { DateRange } from 'react-date-range';
import { useContext, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext.jsx';
import { AuthenticationContext } from '../../context/AuthenticationContext.jsx';
import axios from 'axios';
import { useEffect } from 'react';


// eslint-disable-next-line react/prop-types
function Header({ type }) {
  const [openDate, setOpenDate] = useState(false);
  const [destination, setDestination] = useState("");
  const [hotels, setHotels] = useState([]);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [openOptions, setOpenOptions] = useState(false)
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1
  })

  const handleOption = (name, operation) => {
    setOptions(prev => {
      return {
        ...prev, [name]: operation === "i" ? options[name] + 1 : options[name] - 1,

      }
    })
  }

  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);
  const { user } = useContext(AuthenticationContext);

  const handleSearch = async () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    console.log("Handle search button clicked");

    const params = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination',
      params: { query: destination },
      headers: {
        //process.env.RAPIDAPI_KEY
        'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(params);
      console.log(response.data);  // Utilisez les données comme nécessaire dans votre application
      // Vous pouvez stocker les données dans l'état ou naviguer vers une page avec les résultats
      setHotels(response.data); // Stockez les données dans l'état
      navigate('/hotels', { state: { destination, dates, options, hotels: response.data } });
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }

    // navigate('/hotels', { state: { destination, dates, options, hotels } });
  }



  return (
    <div className="header">
      <video autoPlay muted loop className="background-video">
        <source src="/src/assets/home_page_bg_video2.mp4" type="video/mp4" />
      </video>
      <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
        <div className="headerList">
          <button className="headerListItem selected">
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </button>
          <button className="headerListItem">
            <FontAwesomeIcon icon={faPlane} />
            <span>Flights</span>
          </button>
          <button className="headerListItem">
            <FontAwesomeIcon icon={faEarthAfrica} />
            <span>Flight + Hotel</span>
          </button>
          <button className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Car rentals</span>
          </button>
          <button className="headerListItem">
            <FontAwesomeIcon icon={faIcons} />
            <span>Attractions</span>
          </button>
          <button className="headerListItem">
            <FontAwesomeIcon icon={faTaxi} />
            <span>Airport taxis</span>
          </button>
        </div>
        {type !== "list" &&
          <>
            <h1 className="headerTitle">Find your best JOURNEY</h1>
            <p className="headerDescription">Search low prices on hotels, homes and much more...</p>
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBed} style={{ color: 'black' }} className="headerIcon" />
                <input type="text" placeholder="Where are you going?" className='headerSearchInput' onChange={e => setDestination(e.target.value)} />
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'black' }} className="headerIcon" />
                <span onClick={() => setOpenDate(!openDate)} className='headerSearchText'>{format(dates[0].startDate, "dd/MM/yyyy")} to {format(dates[0].endDate, "dd/MM/yyyy")}</span>
                {openDate && <DateRange
                  editableDateInputs={true}
                  onChange={item => setDates([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dates}
                  className='date'
                  minDate={new Date()}
                />}
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faUser} style={{ color: 'black' }} className="headerIcon" />
                <span onClick={() => setOpenOptions(!openOptions)} className='headerSearchText'>{options.adult} adult(s) • {options.children} children • {options.room} room</span>
                {openOptions && <div className="options">
                  <div className="optionItem">
                    <span className="optionText">Adults</span>
                    <div className="optionCounter">
                      <button
                        disabled={options.adult <= 1}
                        className="optionCounterButton"
                        onClick={() => handleOption("adult", "d")}>-</button>
                      <span className="optionCounterNumber">{options.adult}</span>
                      <button className="optionCounterButton" onClick={() => handleOption("adult", "i")}>+</button>
                    </div>
                  </div>
                  <div className="optionItem">
                    <span className="optionText">Children</span>
                    <div className="optionCounter">
                      <button
                        disabled={options.children <= 0}
                        className="optionCounterButton"
                        onClick={() => handleOption("children", "d")}>-</button>
                      <span className="optionCounterNumber">{options.children}</span>
                      <button className="optionCounterButton" onClick={() => handleOption("children", "i")}>+</button>
                    </div>
                  </div>
                  <div className="optionItem">
                    <span className="optionText">Room</span>
                    <div className="optionCounter">
                      <button
                        disabled={options.room <= 1}
                        className="optionCounterButton"
                        onClick={() => handleOption("room", "d")}>-</button>
                      <span className="optionCounterNumber">{options.room}</span>
                      <button className="optionCounterButton" onClick={() => handleOption("room", "i")}>+</button>
                    </div>
                  </div>
                </div>}
              </div>
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>Search</button>
              </div>
            </div> </>}
      </div>
    </div>
  )
}

export default Header
