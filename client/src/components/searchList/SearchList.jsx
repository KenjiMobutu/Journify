import './SearchList.css';

export const SearchList = () => {
  return (
    <div className='searchItem'>
      <img src="https://cf.bstatic.com/xdata/images/hotel/square240/449972904.jpg?k=1c8d54a59380b75ff14823b378bf989b6ce9d9870dd2d7c0dd9d41db60e90cf7&o=" alt="" className="searchItemImage" />
      <div className="searchItemDesc">
        <h1 className="searchItemName">Hotel Casa de la Marquesa</h1>
        <span className="searchItemDist">350 from beach</span>
        <span className="searchItemTrans">Free airport transport</span>
        <span className="searchItemSub">Luxury kingsize</span>
        <span className="searchItemFeat"> 50m2 • Kingsize bed • Air Conditioning</span>
        <span className="searchItemCancel"> Free cancellation</span>
        <span className="searchItemCancelSub"> You can cancel until 3 days before your arrival!</span>
      </div>
      <div className="searchItemPricing">
        <div className="searchItemRating">
          <span>Fabulous</span>
          <button>8.9</button>
        </div>
        <div className="searchItemPricingText">
          <span className="searchItemPrice">120€</span>
          <span className="searchItemTaxe">Includes taxes and fees</span>
          <button className="searchItemBook">Book now</button>
        </div>
      </div>
    </div>
  )
}

