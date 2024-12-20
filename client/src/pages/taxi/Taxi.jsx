import "./taxi.css";
import * as React from 'react';
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import TaxiSearchList from "../../components/taxiSearchList/TaxiSearchList";


const Taxi = () => {
  const [departOptions, setDepartOptions] = useState([]);
  const [arrivalOptions, setArrivalOptions] = useState([]);
  const [selectedDepart, setSelectedDepart] = useState(null);
  const [selectedArrival, setSelectedArrival] = useState(null);
  const [data, setData] = useState([]);
  const [depart, setDepart] = useState("");
  const [arrival, setArrival] = useState("");
  const [time, setTime] = useState(dayjs());
  const [dates, setDates] = useState(dayjs());
  const formattedDate = dayjs(dates.$d).format('YYYY-MM-DD');
  const formattedTime = dayjs(time.$d).format('HH:mm');

  console.log(depart)
  console.log("Selected Departure:", selectedDepart);
  console.log("Selected Arrival:", selectedArrival);
  console.log("Time:", time.$d);
  console.log("Dates:", dates.$d);
  console.log("Formatted Date:", formattedDate);
  console.log("Formatted Time:", formattedTime);
  console.log("Data:", data);

  const handleSearch = async () => {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/taxi/searchLocation',
      params: {
        query: depart
      },
      headers: {
        'x-rapidapi-key': '',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    const options2 = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/taxi/searchLocation',
      params: {
        query: arrival
      },
      headers: {
        'x-rapidapi-key': '',
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
      url: 'https://booking-com15.p.rapidapi.com/api/v1/taxi/searchTaxi',
      params: {
        pick_up_place_id: selectedDepart,
        drop_off_place_id: selectedArrival,
        pick_up_date: formattedDate,
        pick_up_time: formattedTime,
        currency_code: 'EUR'
      },
      headers: {
        'x-rapidapi-key': '',
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
    <div className="taxi">
      <Navbar />
      <div className="taxiContainer">
        <div className="listWrapperTaxi">
          <div className="listSearchTaxi">
            <h1 className="listSearchTitleTaxi">Book a <span className='hTitle'>TAXI</span></h1>
            <div className="listSearchItemTaxi">
              <label>From</label>
              <input
                type="text"
                placeholder="from: Brussels"
                onChange={(e) => setDepart(e.target.value)}
              />
            </div>
            <div className="listSearchItemTaxi">
              <label>To</label>
              <input
                type="text"
                placeholder="to: Genval"
                onChange={(e) => setArrival(e.target.value)}
              />
            </div>
            <button onClick={handleSearch} className="destinationSearchButtonTaxi">
              Search Destinations
            </button>
            {departOptions.length > 0 && (
              <div className="listSearchItemTaxi">
                <label>Select Departure</label>
                <select
                  onChange={(e) => setSelectedDepart(e.target.value)}
                  className="selectedDepartureTaxi"
                >
                  <option value="">Select Departure</option>
                  {departOptions.map((option, index) => (
                    <option key={index} value={option.googlePlaceId}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {arrivalOptions.length > 0 && (
              <div className="listSearchItemTaxi">
                <label>Select Arrival</label>
                <select
                  onChange={(e) => setSelectedArrival(e.target.value)}
                  className="selectedDepartureTaxi"
                >
                  <option value="">Select Arrival</option>
                  {arrivalOptions.map((option, index) => (
                    <option key={index} value={option.googlePlaceId}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="listSearchItemTaxi">
              <label>Departure Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dates}
                  onChange={(newValue) => setDates(newValue)}
                  minDate={dayjs()}
                  className="datePicker"
                />
              </LocalizationProvider>
            </div>
            <div className="listSearchItemTaxi">
              <label>Time</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={time}
                  onChange={(newValue) => setTime(newValue)}
                  className="datePicker"
                />
              </LocalizationProvider>
            </div>
          </div>
          <button
            onClick={handleFinalSearch}
            className="listSearchButtonTaxi"
            disabled={!selectedDepart || !selectedArrival}
          >
            Search Taxi
          </button>
        </div>
        <div className="listResultsflight">
          {data.data && data.data.results.length > 0 ? (
            data.data.results.map((item, index) => (
              <TaxiSearchList item={item} index={index} key={item.resultId} journeys={data.data.journeys} />
            ))
          ) : (
            "No Taxis found"
          )}
        </div>
      </div>
    </div>

  );
};

export default Taxi;
