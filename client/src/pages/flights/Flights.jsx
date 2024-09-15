import Navbar from "../../components/navbar/Navbar"
import "./flights.css"
import { useState } from 'react'
import { format, addDays, isValid } from "date-fns";
import { DateRange } from "react-date-range"
import FlightSearchList from "../../components/flightSearchList/FlightSearchList";
import axios from "axios";


const Flights = () => {
  const [departOptions, setDepartOptions] = useState([]);
  const [arrivalOptions, setArrivalOptions] = useState([]);
  const [selectedDepart, setSelectedDepart] = useState(null);
  const [selectedArrival, setSelectedArrival] = useState(null);
  const [loadingDestinations, setLoadingDestinations] = useState(false); // État pour gérer le chargement du bouton "Search Destinations"
  const [loadingFlights, setLoadingFlights] = useState(false); // État pour gérer le chargement du bouton "Search Flights"
  const rapidapiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  const [depart, setDepart] = useState("");
  const [arrival, setArrival] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [data, setData] = useState([]);

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

  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    sort: 'BEST',
    cabinClass: 'ECONOMY',
  });

  const handleSearch = async () => {
    setLoadingDestinations(true); // Définir le chargement sur true

    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination',
      params: {
        query: depart
      },
      headers: {
        'x-rapidapi-key': rapidapiKey,
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
        'x-rapidapi-key': rapidapiKey,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const response2 = await axios.request(options2);
      setDepartOptions(response.data.data);
      setArrivalOptions(response2.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDestinations(false); // Réinitialiser l'état de chargement
    }
  };

  const handleFinalSearch = async () => {
    setLoadingFlights(true); // Définir le chargement sur true

    if (!selectedDepart || !selectedArrival) {
      console.error("Please select both departure and arrival locations.");
      setLoadingFlights(false);
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
        'x-rapidapi-key': rapidapiKey,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(opt);
      setData(response.data);
    } catch (error) {
      console.error("Final search error:", error);
    } finally {
      setLoadingFlights(false); // Réinitialiser l'état de chargement
    }
  };

  return (
    <div className="flights">
      <Navbar />
      <div className="flightsContainer">
        <div className="listContainerflight">
          <div className="listWrapperflight">
            <div className="listSearchflight">
              <h1 className="listSearchTitleflight">
                Book a <span className="hTitle">FLIGHT</span>
              </h1>
              <div className="listSearchItemflight">
                <label>From</label>
                <input type="text" placeholder="from: Brussels" onChange={e => setDepart(e.target.value)} />
              </div>
              <div className="listSearchItemflight">
                <label>To</label>
                <input type="text" placeholder="to: Miami" onChange={e => setArrival(e.target.value)} />
              </div>
              <button onClick={handleSearch} className="destinationSearchButtonflight">
                {loadingDestinations ? "Processing..." : "Search Destinations"}
              </button>

              {departOptions.length > 0 && (
                <div className="listSearchItemflight">
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
                <div className="listSearchItemflight">
                  <label>Select Arrival</label>
                  <select onChange={e => setSelectedArrival(e.target.value)} className="selectedAirport">
                    <option value="">Select Arrival</option>
                    {arrivalOptions.map((option, index) => (
                      <option key={index} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="listSearchItemflight">
                <label>Departure & Arrival dates</label>
                <span className="dateRangeDisplay" onClick={() => setOpenDate(!openDate)}>
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
              <div className="listSearchItemflight">
                <label>Options</label>
                <div className="listSearchOptionsflight">
                  <div className="listSearchOptionItemflight">
                    <span className="listSearchOptionTextflight">Adult(s)</span>
                    <input
                      type="number"
                      className="listSearchOptionInputflight"
                      onChange={e => setOptions(prev => ({ ...prev, adult: e.target.value }))}
                      placeholder={options.adult}
                      min={1}
                    />
                  </div>
                  <div className="listSearchOptionItemflight">
                    <span className="listSearchOptionTextflight">Children</span>
                    <input
                      type="number"
                      className="listSearchOptionInputflight"
                      onChange={e => setOptions(prev => ({ ...prev, children: e.target.value }))}
                      placeholder={options.children}
                      min={0}
                    />
                  </div>
                  <div className="listSearchOptionItemflight">
                    <span className="listSearchOptionTextflight">Sort</span>
                    <select
                      className="listFlightSearchOptionInputflight"
                      onChange={e => setOptions(prev => ({ ...prev, sort: e.target.value }))}
                      value={options.sort || ""}
                    >
                      <option value="">Select an option</option>
                      <option value="BEST">Best</option>
                      <option value="CHEAPEST">Cheapest</option>
                      <option value="FASTEST">Fastest</option>
                    </select>
                  </div>
                  <div className="listSearchOptionItemflight">
                    <span className="listSearchOptionTextflight">Cabin Class</span>
                    <select
                      className="listFlightSearchOptionInputflight"
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
                className="listSearchButtonflight"
                disabled={!selectedDepart || !selectedArrival || loadingFlights}
              >
                {loadingFlights ? "Processing..." : "Search Flights"}
              </button>
            </div>
            <div className="listResultsflight">
              {data?.data?.flightOffers?.length > 0 ? (
                data.data.flightOffers.map((item, index) => (
                  <FlightSearchList item={item} index={index} key={item.token} flightKey={item.token} options={options} />
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
