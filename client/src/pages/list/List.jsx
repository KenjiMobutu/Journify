import "./List.css"
import Navbar from '../../components/navbar/Navbar'
import { useLocation } from "react-router-dom"
import { useState } from 'react'
import { format } from "date-fns";
import { DateRange } from "react-date-range"
import { SearchList } from "../../components/searchList/SearchList"
import useFetch from "../../hooks/useFetch"
import axios from "axios"
import { useContext } from "react"
import { SearchContext } from '../../context/SearchContext.jsx';
import { useNavigate } from "react-router-dom"

const List = () => {
  const research = useLocation()
  console.log(research);
  const [destination, setDestination] = useState(research.state.destination);
  const [dates, setDates] = useState(research.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(research.state.options);
  const [hotels, setHotels] = useState(research.state.hotels);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  //const handleClick = () => { reFetch() };
  //console.log(hotels.data); //resultat de la recherche
  const { loading } = useFetch(`/api/hotels?city=${destination}&min=${min || 0}&max=${max || 999}`);
  const { dispatch } = useContext(SearchContext);
  const navigate = useNavigate();
  console.log("DESTINATION :", destination);
  console.log("DATES :", dates);
  console.log("OPTIONS :", options.adult, options.children, options.room);
  console.log("HOTELS :", hotels);
  console.log("MIN :", min);
  console.log("MAX :", max);


  const handleSearch = async () => {
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
            departure_date: format(dates[0].endDate, "yyyy-MM-dd"),   // Date de départ formatée
            price_min: min || '0',
            price_max: max || '9999',
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


  return (
    <div>
      <Navbar />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="listSearchTitle">Search</h1>
            <div className="listSearchItem">
              <label>Destination</label>
              <input type="text" placeholder={destination} onChange={e => setDestination(e.target.value)} />
            </div>
            <div className="listSearchItem">
              <label>Check-in</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}
              </span>
              {openDate && (<DateRange onChange={item => setDates([item.selection])}
                minDate={new Date()}
                ranges={dates} />)}
            </div>
            <div className="listSearchItem">
              <label>Options</label>
              <div className="listSearchOptions">
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">
                    Min price per night
                  </span>
                  <input onChange={e => setMin(e.target.value)} type="number" className="listSearchOptionInput" />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">
                    Max price per night
                  </span>
                  <input onChange={e => setMax(e.target.value)} type="number" className="listSearchOptionInput" />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">
                    Adult(s)
                  </span>
                  <input
                    type="number"
                    className="listSearchOptionInput"
                    onChange={e => setOptions(prev => ({ ...prev, adult: e.target.value }))}
                    placeholder={options.adult}
                    min={1}
                  />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">
                    Children
                  </span>
                  <input
                    type="number"
                    className="listSearchOptionInput"
                    onChange={e => setOptions(prev => ({ ...prev, children: e.target.value }))}
                    placeholder={options.children}
                    min={0}
                  />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">
                    Room(s)
                  </span>
                  <input
                    type="number"
                    className="listSearchOptionInput"
                    onChange={e => setOptions(prev => ({ ...prev, room: e.target.value }))}
                    placeholder={options.room}
                    min={1}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleSearch} className="listSearchButton">Search</button>
          </div>
          <div className="listResults">
            {loading ? (
              "Loading..."
            ) : (
              hotels.data.hotels.map(item => (
                <SearchList item={item} key={item.hotel_id} dates={dates} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
