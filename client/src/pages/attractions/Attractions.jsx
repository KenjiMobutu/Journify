import "./attractions.css"
import Navbar from "../../components/navbar/Navbar"
import { useState } from "react"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import AttractionSearchList from "../../components/attractionSearchList/AttractionSearchList";

const Attractions = ({socket}) => {
  const [city, setCity] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [dates, setDates] = useState(dayjs());
  const [startdDates, setStartDates] = useState(dayjs());
  const [endDates, setEndDates] = useState(dayjs());
  const formattedSDate = dayjs(startdDates.$d).format('YYYY-MM-DD');
  const formattedEDate = dayjs(endDates.$d).format('YYYY-MM-DD');
  const [data, setData] = useState([]);
  const rapidapiKey = import.meta.env.VITE_RAPIDAPI_KEY;

  console.log(data)
  console.log("selectedCity:", selectedCity);
  console.log("Dates:", startdDates.$d);

  const handleSearch = async () => {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation',
      params: {
        query: city
      },
      headers: {
        'x-rapidapi-key': rapidapiKey,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setCityOptions(response.data.data.products);
      console.log("Departure Options:", response);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFinalSearch = async () => {

    if (!selectedCity || !startdDates || !endDates) {
      console.error("Please select a city, start date and end date");
      return;
    }

    const opt = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions',
      params: {
        id: selectedCity,
        startDate: formattedSDate,
        endDate: formattedEDate,
        sortBy: 'trending',
        currency_code: 'EUR',
        languagecode: 'en-us'
      },
      headers: {
        'x-rapidapi-key': rapidapiKey,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(opt);
      setData(response.data);
      console.log("Final search data:", response.data);
    } catch (error) {
      console.error("Final search error:", error);
    }
  }

  return (
    <>
      <Navbar socket={socket}/>
      <div className="Attractions">
        <div className="AttractionsContainer">
          <div className="searchWrapperAttraction">
            <h1 className="searchTitleAttraction">Find an <span className='hTitle'>Attractions</span></h1>
            <div className="searchItemAttraction">
              <label>City</label>
              <input
                type="text"
                placeholder="Brussels"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button onClick={handleSearch} className="citySearchButtonAttraction">
              Search City
            </button>
            {cityOptions.length > 0 && (
              <div className="searchItemAttraction">
                <label>Select City</label>
                <select
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="selectedCityAttraction"
                >
                  <option value="">Select City</option>
                  {cityOptions.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.cityName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="searchItemAttraction">
              <label>Start Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dates}
                  onChange={(newValue) => setStartDates(newValue)}
                  minDate={dayjs()}
                  className="datePicker"
                />
              </LocalizationProvider>
            </div>
            <div className="searchItemAttraction">
              <label>End Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dates}
                  onChange={(newValue) => setEndDates(newValue)}
                  minDate={dayjs()}
                  className="datePicker"
                />
              </LocalizationProvider>
            </div>
            <button
              onClick={handleFinalSearch}
              className="listSearchButtonTaxi"
              disabled={!selectedCity || !dates}
            >
              Search Attraction
            </button>
          </div>
          <div className="listResultsAttraction">
            {data.data && data.data.products.length > 0 ? (
              data.data.products.map((item, index) => (
                <AttractionSearchList item={item} index={index} key={item.resultId} startDate={startdDates} endDate={endDates}/>
              ))
            ) : (
              "No Attractions found!"
            )}
          </div>
        </div>
      </div>

    </>
  )
}

export default Attractions
