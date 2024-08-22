/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './SearchList.css';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const SearchList = ({ item }) => {
  // const research = useLocation();
  // const [hotels, setHotels] = useState(research.state.hotels);
  // console.log("Hotels DE RAPID API ==> :" , hotels.data);
  //console.log(item);
  //console.log("Review Score:", item.property.reviewScore);
  return (
    <div className='searchItem'>
      <img src={item.property.photoUrls} alt="" className="searchItemImage" />
      <div className="searchItemDesc">
        <h1 className="searchItemName">{item.property.name}</h1>
        <span className="searchItemDist">{item.accessibilityLabel}</span>
        <span className="searchItemTrans">Free airport transport</span>
        <span className="searchItemSub">Luxury kingsize</span>
        <span className="searchItemFeat"> {item.description}</span>
        <span className="searchItemCancel"> Free cancellation</span>
        <span className="searchItemCancelSub"> You can cancel until 3 days before your arrival!</span>
      </div>
      <div className="searchItemPricing">
        {item.property.reviewScore && <div className="searchItemRating">
          <span>{item.property.reviewScoreWord}</span>
          <button>{item.property.reviewScore}</button>

        </div>}
        <div className="searchItemTaxe">Checkin from: {item.property.checkin.fromTime}</div>
        <div className="searchItemTaxe">Checkout until: {item.property.checkout.untilTime}</div>
        <div className="searchItemPricingText">
          <span className="searchItemPrice">{Math.round(item.property.priceBreakdown?.grossPrice.value)}€</span>
          <span className="searchItemTaxe">{item.property.priceBreakdown?.benefitBadges?.[0]?.text}</span>
          <span className="searchItemTaxe">Includes taxes and fees</span>
          <Link
            to={{
              pathname: `/hotels/${item.hotel_id}`  // Transmission du reviewScore
            }}
            state={{ reviewScore: item.property.reviewScore, hotel: item }}
          >

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
