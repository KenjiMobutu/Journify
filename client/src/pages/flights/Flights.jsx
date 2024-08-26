import Navbar from "../../components/navbar/Navbar"
import "./flights.css"
import { useLocation } from "react-router-dom"
import { useState } from 'react'
import { format, addDays, isValid } from "date-fns";
import { DateRange } from "react-date-range"
import FlightSearchList from "../../components/flightSearchList/FlightSearchList";
import axios from "axios";
import { de } from "date-fns/locale";

const Flights = () => {
  const [departOptions, setDepartOptions] = useState([]);
  const [arrivalOptions, setArrivalOptions] = useState([]);
  const [selectedDepart, setSelectedDepart] = useState(null);
  const [selectedArrival, setSelectedArrival] = useState(null);

  console.log("Selected Departure:", selectedDepart);
  const [depart, setDepart] = useState("");
  const [arrival, setArrival] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [data, setData] = useState([]);
  console.log("Data:", data);
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

  console.log("DATES :", dates);

  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    sort: 'BEST',
    cabinClass: 'ECONOMY',
  });

  console.log("OPTIONS :", options.adult, options.children, options.sort, options.cabinClass);

  const handleSearch = async () => {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination',
      params: {
        query: depart
      },
      headers: {
        'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    const options2 = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination',
      params: {
        query: arrival
      },
      headers: {
        'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const response2 = await axios.request(options2);
      setDepartOptions(response.data.data);
      setArrivalOptions(response2.data.data);
      console.log("Departure Options:", response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalSearch = async () => {

    if (!selectedDepart || !selectedArrival) {
      console.error("Please select both departure and arrival locations.");
      return;
    }

    const opt = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights',
      params: {
        fromId: selectedDepart,
        toId: selectedArrival,
        departDate: format(dates[0].startDate, "yyyy-MM-dd"),
        returnDate: format(dates[0].endDate, "yyyy-MM-dd"),
        adults: options.adult,
        children: options.children,
        sort: options.sort,
        cabinClass: options.cabinClass,
        currency_code: 'EUR'
      },
      headers: {
        'x-rapidapi-key': '107940df2amsh06485f68eef98b0p18f196jsnbd5d1d92b1c0',
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
  };



  return (
    <div className="flights">
      <Navbar />
      <div className="flightsContainer">
        Flights
        <div className="listContainer">
          <div className="listWrapper">
            <div className="listSearch">
              <h1 className="listSearchTitle">Search</h1>
              <div className="listSearchItem">
                <label>From</label>
                <input type="text" placeholder="from: Brussels" onChange={e => setDepart(e.target.value)} />
              </div>
              <div className="listSearchItem">
                <label>To</label>
                <input type="text" placeholder="to: Miami" onChange={e => setArrival(e.target.value)} />
              </div>
              <button onClick={handleSearch} className="destinationSearchButton">Search Destinations</button>

              {departOptions.length > 0 && (
                <div className="listSearchItem">
                  <label>Select Departure</label>
                  <select onChange={e => setSelectedDepart(e.target.value)} className="selectedAirport">
                    <option value="">Select Departure</option>
                    {departOptions.map((option, index) => (
                      <option key={index} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {arrivalOptions.length > 0 && (
                <div className="listSearchItem">
                  <label>Select Arrival</label>
                  <select onChange={e => setSelectedArrival(e.target.value)} className="selectedAirport">
                    <option value="">Select Arrival</option>
                    {arrivalOptions.map((option, index) => (
                      <option key={index} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="listSearchItem">
                <label>Departure & Arrival dates</label>
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
                      Sort
                    </span>
                    <select
                      className="listFlightSearchOptionInput"
                      onChange={e => setOptions(prev => ({ ...prev, sort: e.target.value }))}
                      value={options.sort || ""}
                    >
                      <option value="">Select an option</option>
                      <option value="BEST">Best</option>
                      <option value="CHEAPEST">Cheapest</option>
                      <option value="FASTEST">Fastest</option>
                    </select>
                  </div>
                  <div className="listSearchOptionItem">
                    <span className="listSearchOptionText">
                      Cabin Class
                    </span>
                    <select
                      className="listFlightSearchOptionInput"
                      onChange={e => setOptions(prev => ({ ...prev, cabinClass: e.target.value }))}
                      value={options.cabinClass || ""}
                    >
                      <option value="">Select Cabin Class</option>
                      <option value="ECONOMY">Economy</option>
                      <option value="PREMIUM_ECONOMY">Premium Economy</option>
                      <option value="BUSINESS">Business</option>
                      <option value="FIRST">First</option>
                    </select>
                  </div>

                </div>
              </div>
              <button
                onClick={handleFinalSearch}
                className="listSearchButton"
                disabled={!selectedDepart || !selectedArrival}
              >
                Search Flights
              </button>
            </div>
            <div className="listResults">
              {data.data && data.data.flightOffers.length > 0 ? (
                data.data.flightOffers.map((item, index) => (
                  <FlightSearchList item={item} index={index} key={item.token} flightKey={item.token} options={options}/>
                ))
              ) : (
                "No flights found"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flights
