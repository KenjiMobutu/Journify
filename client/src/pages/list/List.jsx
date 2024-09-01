import "./List.css";
import Navbar from '../../components/navbar/Navbar';
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import { SearchList } from "../../components/searchList/SearchList";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { SearchContext } from '../../context/SearchContext.jsx';

const List = () => {
  const research = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);

  const [destination, setDestination] = useState(research.state.destination);
  const [dates, setDates] = useState(research.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(research.state.options);
  const [hotels, setHotels] = useState(research.state.hotels);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [attractions, setAttractions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const { loading, data } = useFetch(`/api/hotels?city=${destination}&min=${min || 0}&max=${max || 999}`);

  useEffect(() => {
    if (!selectedCity) {
      findCity();
    } else {
      findAttractions();
    }
  }, [selectedCity]);

  const findCity = async () => {
    try {
      const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation', {
        params: { query: destination },
        headers: {
          'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
        }
      });
      const cityId = response.data.data.destinations[0]?.id;
      setSelectedCity(cityId);
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  const findAttractions = async () => {
    if (!selectedCity) return;

    try {
      const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions', {
        params: {
          id: selectedCity,
          sortBy: 'trending',
          currency_code: 'EUR',
          languagecode: 'en-us',
        },
        headers: {
          'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
        }
      });
      setAttractions(response.data.data.products);
      console.log("!!!Attractions:", response.data.data.products);
    } catch (error) {
      console.error("Error fetching attractions:", error);
    }
  };

  const handleSearch = async () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });

    try {
      const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination', {
        params: { query: destination },
        headers: {
          'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
        }
      });

      if (Array.isArray(response.data.data)) {
        const destinationId = response.data.data[0]?.dest_id;
        const searchType = response.data.data[0]?.search_type;

        if (destinationId && searchType) {
          const hotelResponse = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels', {
            params: {
              dest_id: destinationId,
              search_type: searchType,
              arrival_date: format(dates[0].startDate, "yyyy-MM-dd"),
              departure_date: format(dates[0].endDate, "yyyy-MM-dd"),
              price_min: min || '0',
              price_max: max || '9999',
            },
            headers: {
              'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
              'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
            }
          });

          setHotels(hotelResponse.data);
          navigate('/hotels', { state: { destination, dates, options, hotels: hotelResponse.data, attractions } });
        }
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
              <input
                type="text"
                placeholder={destination}
                onChange={e => setDestination(e.target.value)}
              />
            </div>
            <div className="listSearchItem">
              <label>Check-in</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={item => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="listSearchItem">
              <label>Options</label>
              <div className="listSearchOptions">
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">Min price per night</span>
                  <input
                    type="number"
                    onChange={e => setMin(e.target.value)}
                    className="listSearchOptionInput"
                  />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">Max price per night</span>
                  <input
                    type="number"
                    onChange={e => setMax(e.target.value)}
                    className="listSearchOptionInput"
                  />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">Adult(s)</span>
                  <input
                    type="number"
                    onChange={e => setOptions(prev => ({ ...prev, adult: e.target.value }))}
                    className="listSearchOptionInput"
                    placeholder={options.adult}
                    min={1}
                  />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">Children</span>
                  <input
                    type="number"
                    onChange={e => setOptions(prev => ({ ...prev, children: e.target.value }))}
                    className="listSearchOptionInput"
                    placeholder={options.children}
                    min={0}
                  />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">Room(s)</span>
                  <input
                    type="number"
                    onChange={e => setOptions(prev => ({ ...prev, room: e.target.value }))}
                    className="listSearchOptionInput"
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
              hotels?.data?.hotels?.map(item => (
                <SearchList
                  item={item}
                  key={item.hotel_id}
                  dates={dates}
                  attractions={attractions}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
