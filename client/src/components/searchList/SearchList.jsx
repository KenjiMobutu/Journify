import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './SearchList.css';

export const SearchList = ({ item }) => {
  return (
    <div className='searchItem'>
      <img src={item.photos[0]} alt="" className="searchItemImage" />
      <div className="searchItemDesc">
        <h1 className="searchItemName">{item.name}</h1>
        <span className="searchItemDist">{item.distance}m from beach</span>
        <span className="searchItemTrans">Free airport transport</span>
        <span className="searchItemSub">Luxury kingsize</span>
        <span className="searchItemFeat"> {item.description}</span>
        <span className="searchItemCancel"> Free cancellation</span>
        <span className="searchItemCancelSub"> You can cancel until 3 days before your arrival!</span>
      </div>
      <div className="searchItemPricing">
        {item.rating && <div className="searchItemRating">
          <span>Fabulous</span>
          <button>{item.rating}</button>
        </div>}
        <div className="searchItemPricingText">
          <span className="searchItemPrice">{item.price}€</span>
          <span className="searchItemTaxe">Includes taxes and fees</span>
          <Link to={`/hotels/${item._id}`}>
            <button className="searchItemBook">Book now</button>
          </Link>
        </div>
      </div>
    </div>
  )

}

// Définition des PropTypes
SearchList.propTypes = {
  item: PropTypes.shape({
    photos: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    rating: PropTypes.number,
    price: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};
