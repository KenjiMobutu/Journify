import "./loveProperties.css";
import useFetch from "../../hooks/useFetch";

const LoveProperties = () => {
  const { data, loading, error } = useFetch("/api/hotels?featured=true&limit=4");
  if (error) return <p>Error loading data</p>;
  return (
    <div className="lProperties">
      {loading ? ("Loading...") :
        <>
          {data.map((item) => (
            <div className="lPropListItem" key={item._id}>
              <img src={item.photos[0]}
                alt=""
                className="lPropListImg" />
              <span className="lPName">{item.name}</span>
              <span className="lPCity">{item.city}</span>
              <span className="lPPrice">From {item.price}€</span>
              {item.rating && <div className="lPRating">
                <button>{item.rating}</button>
                <span>Fabulous</span>
              </div>}
            </div>
          ))}
        </>}
    </div>
  )
}

export default LoveProperties
