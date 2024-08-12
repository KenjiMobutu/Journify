import "./List.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
import { useLocation } from "react-router-dom"
import { useState } from 'react'
import { format } from "date-fns";
import { DateRange } from "react-date-range"
import { SearchList } from "../../components/searchList/SearchList"
import useFetch from "../../hooks/useFetch"

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
  const handleClick = () => { reFetch() };
  console.log(hotels.data); //resultat de la recherche
  const { data, loading, error, reFetch } = useFetch(`/api/hotels?city=${destination}&min=${min || 0}&max=${max || 999}`);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="listSearchTitle">Search</h1>
            <div className="listSearchItem">
              <label>Destination</label>
              <input type="text" placeholder={destination} />
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
                  <input type="number" className="listSearchOptionInput" placeholder={options.adult} min={1} />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">
                    Children
                  </span>
                  <input type="number" className="listSearchOptionInput" placeholder={options.children} min={0} />
                </div>
                <div className="listSearchOptionItem">
                  <span className="listSearchOptionText">
                    Room(s)
                  </span>
                  <input type="number" className="listSearchOptionInput" placeholder={options.room} min={1} />
                </div>
              </div>
            </div>
            <button onClick={handleClick} className="listSearchButton">Search</button>
          </div>
          <div className="listResults">
            {loading ? ("Loading...") : <>
              {hotels.data.map(item => (
                <SearchList item={item} key={item._id} />
              ))
              }
            </>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
