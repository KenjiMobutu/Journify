import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faPlane, faCar, faIcons, faTaxi, faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import "./header.css";
import { DateRange } from 'react-date-range';
import { useContext, useState, useEffect } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, addDays, isValid } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext.jsx';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { AuthenticationContext } from '../../context/AuthenticationContext.jsx';
import videoSrc from '../../assets/home_page_bg_video2.mp4';

// Clé API Google Maps
const GOOGLE_MAPS_API_KEY = "AIzaSyCZoVUq46vX7FuZjAh2l3h2dVZVb_ZMr6w";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

// Fonction GoogleMaps, déplacée hors de la fonction Header
function GoogleMaps({ setDestination }) {  // Ajout de setDestination comme prop
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const loaded = useState(false);

  const autocompleteService = { current: null };

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = debounce((request, callback) => {
    autocompleteService.current.getPlacePredictions(request, callback);
  }, 400);

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      sx={{ width: 250 }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        // Extraire la première partie avant la virgule
        const firstPart = newValue ? newValue.description.split(',')[0] : '';
        setValue(newValue);
        setDestination(firstPart);  // Mettre à jour la destination avec la première valeur
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Add a location" fullWidth />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length]),
        );
        return (
          <li key={key} {...optionProps}>
            <Grid container sx={{ alignItems: 'center', height: 40 }}>
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

// Fonction Header, en utilisant GoogleMaps
function Header({ type }) {
  const [openDate, setOpenDate] = useState(false);
  const [destination, setDestination] = useState(""); // Utiliser setDestination pour mettre à jour
  console.log("Destination", destination);
  const [hotels, setHotels] = useState([]);
  // Initialiser les dates avec aujourd'hui et demain par défaut
  const [dates, setDates] = useState(() => {
    const startDate = new Date();
    const endDate = addDays(new Date(), 1);

    return [
      {
        startDate: isValid(new Date()) ? new Date() : startDate,
        endDate: isValid(addDays(new Date(), 1)) ? addDays(new Date(), 1) : endDate,
        key: 'selection'
      }
    ];
  });

  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1
  });

  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);
  const { user } = useContext(AuthenticationContext);

  const handleOption = (name, operation) => {
    setOptions(prev => ({
      ...prev, [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
    }));
  };

  const handleSearch = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    console.log("Handle search button clicked");

    const params = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination',
      params: { query: destination },
      headers: {
        'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(params);

      if (Array.isArray(response.data.data)) {
        const destinationIds = response.data.data.map(dest => dest.dest_id);
        const destinationTypes = response.data.data.map(dest => dest.search_type);
        console.log(destinationIds);
        console.log(destinationTypes);
        console.log(format(dates[0].startDate, "yyyy-MM-dd"));  // Vérifiez cette valeur
        console.log(format(dates[0].endDate, "yyyy-MM-dd"));    // Vérifiez cette valeur

        const hotelParams = {
          method: 'GET',
          url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels',
          params: {
            dest_id: destinationIds[0],                // Premier ID de destination
            search_type: destinationTypes[0],          // Premier type de recherche
            arrival_date: format(dates[0].startDate, "yyyy-MM-dd"),  // Date d'arrivée formatée
            departure_date: format(dates[0].endDate, "yyyy-MM-dd")   // Date de départ formatée
          },
          headers: {
            'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
            'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
          }
        };

        const hotelResponse = await axios.request(hotelParams);
        console.log(hotelResponse.data);

        setHotels(hotelResponse.data); // Utilisez la réponse des hôtels ici
        navigate('/hotels', { state: { destination, dates, options, hotels: hotelResponse.data } });
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleFlight = () => {
    navigate('/flights');
  };

  const handleCar = () => {
    navigate('/car');
  };

  const handleAttraction = () => {
    navigate('/attractions');
  };

  const handleTaxi = () => {
    navigate('/taxi');
  };




  return (
    <div className="header">
      <video autoPlay muted loop className="background-video">
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className={type === 'list' ? 'headerContainer listMode' : 'headerContainer'}>
        {user ? (
          <>
            {/* Affichez la barre de recherche */}
            <div className="headerList">
              <button className="headerListItem selected">
                <FontAwesomeIcon icon={faBed} />
                <span>Stays</span>
              </button>
              <button className="headerListItem" onClick={handleFlight}>
                <FontAwesomeIcon icon={faPlane} />
                <span>Flights</span>
              </button>
              {/* <button className="headerListItem" onClick={handleCar}>
                <FontAwesomeIcon icon={faCar} />
                <span>Car rentals</span>
              </button> */}
              <button className="headerListItem" onClick={handleAttraction}>
                <FontAwesomeIcon icon={faIcons} />
                <span>Attractions</span>
              </button>
              <button className="headerListItem" onClick={handleTaxi}>
                <FontAwesomeIcon icon={faTaxi} />
                <span>Taxis</span>
              </button>
            </div>
            {type !== 'list' && (
              <>
                <h1 className="headerTitle">
                  <span className="hTitle">JOURNIFY YOUR LIFE</span>
                </h1>
                <div className="headerSearch">
                  <div className="headerSearchItem">
                    <GoogleMaps setDestination={setDestination} />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'black' }} className="headerIcon" />
                    <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
                      {format(dates[0].startDate, 'dd/MM/yyyy')} to {format(dates[0].endDate, 'dd/MM/yyyy')}
                    </span>
                    {openDate && (
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDates([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dates}
                        className="date"
                        minDate={new Date()}
                      />
                    )}
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faUser} style={{ color: 'black' }} className="headerIcon" />
                    <span onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">
                      {options.adult} adult(s) • {options.children} children • {options.room} room
                    </span>
                    {openOptions && (
                      <div className="options">
                        <div className="optionItem">
                          <span className="optionText">Adults</span>
                          <div className="optionCounter">
                            <button
                              disabled={options.adult <= 1}
                              className="optionCounterButton"
                              onClick={() => handleOption('adult', 'd')}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">{options.adult}</span>
                            <button className="optionCounterButton" onClick={() => handleOption('adult', 'i')}>
                              +
                            </button>
                          </div>
                        </div>
                        <div className="optionItem">
                          <span className="optionText">Children</span>
                          <div className="optionCounter">
                            <button
                              disabled={options.children <= 0}
                              className="optionCounterButton"
                              onClick={() => handleOption('children', 'd')}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">{options.children}</span>
                            <button className="optionCounterButton" onClick={() => handleOption('children', 'i')}>
                              +
                            </button>
                          </div>
                        </div>
                        <div className="optionItem">
                          <span className="optionText">Room</span>
                          <div className="optionCounter">
                            <button
                              disabled={options.room <= 1}
                              className="optionCounterButton"
                              onClick={() => handleOption('room', 'd')}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">{options.room}</span>
                            <button className="optionCounterButton" onClick={() => handleOption('room', 'i')}>
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="headerSearchItem">
                    <button className="headerBtn" onClick={handleSearch}>
                      Search
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          // Message pour les utilisateurs non connectés
          <div className="notLoggedInMessage">
            <p>Please log in or register and <span className="hTitle">JOURNIFY </span>your life.</p>
            <button className="headerBtn" onClick={() => navigate('/login')}>
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header;
