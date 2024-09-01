/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './SearchList.css';

export const SearchList = ({ item, attractions }) => {
  return (
    <div className='searchItem'>
      <img src={item.property.photoUrls?.[0] || '/default-hotel.png'} alt="Hotel" className="searchItemImage" />
      <div className="searchItemDesc">
        <h1 className="searchItemName">{item.property.name}</h1>
        <span className="searchItemDist">{item.accessibilityLabel || 'Distance unknown'}</span>
        <span className="searchItemTrans">Free airport transport</span>
        <span className="searchItemSub">Luxury kingsize</span>
        <span className="searchItemFeat">{item.description}</span>
        <span className="searchItemCancel">Free cancellation</span>
        <span className="searchItemCancelSub">You can cancel until 3 days before your arrival!</span>
      </div>
      <div className="searchItemPricing">
        {item.property.reviewScore && (
          <div className="searchItemRating">
            <span>{item.property.reviewScoreWord || 'Rating'}</span>
            <button>{item.property.reviewScore}</button>
          </div>
        )}
        <div className="searchItemTaxe">Check-in from: {item.property.checkin?.fromTime || 'N/A'}</div>
        <div className="searchItemTaxe">Check-out until: {item.property.checkout?.untilTime || 'N/A'}</div>
        <div className="searchItemPricingText">
          <span className="searchItemPrice">{Math.round(item.property.priceBreakdown?.grossPrice?.value || 0)}€</span>
          <span className="searchItemTaxe">{item.property.priceBreakdown?.benefitBadges?.[0]?.text || 'Taxes included'}</span>
          <span className="searchItemTaxe">Includes taxes and fees</span>
          <Link
            to={`/hotels/${item.hotel_id}`}
            state={{ reviewScore: item.property.reviewScore, hotel: item, attractions }}
          >
            <button className="searchItemBook">Book now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Définition des PropTypes
SearchList.propTypes = {
  item: PropTypes.shape({
    property: PropTypes.shape({
      photoUrls: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string.isRequired,
      reviewScore: PropTypes.number,
      reviewScoreWord: PropTypes.string,
      checkin: PropTypes.shape({
        fromTime: PropTypes.string,
      }),
      checkout: PropTypes.shape({
        untilTime: PropTypes.string,
      }),
      priceBreakdown: PropTypes.shape({
        grossPrice: PropTypes.shape({
          value: PropTypes.number,
        }),
        benefitBadges: PropTypes.arrayOf(PropTypes.shape({
          text: PropTypes.string,
        })),
      }),
    }).isRequired,
    accessibilityLabel: PropTypes.string,
    description: PropTypes.string.isRequired,
    hotel_id: PropTypes.string.isRequired,
  }).isRequired,
  attractions: PropTypes.array.isRequired,
};
