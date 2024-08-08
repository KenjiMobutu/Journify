import "./loveProperties.css";

const LoveProperties = () => {
  return(
    <div className="lProperties">
      <div className="lPropListItem">
        <img src="https://cf.bstatic.com/xdata/images/hotel/square240/474334238.jpg?k=4836f859f3c3bcf22b108e45b357cc4c3c045eff49feab5b803bd4d575cb905b&o="
          alt=""
          className="lPropListImg" />
        <span className="lPName">Casa Rural La Marquesa</span>
        <span className="lPCity">Abajo</span>
        <span className="lPPrice">From 80€</span>
        <div className="lPRating">
          <button>8.9</button>
          <span>Fabulous</span>
        </div>
      </div>

      <div className="lPropListItem">
        <img src="https://cf.bstatic.com/xdata/images/hotel/square240/320022978.jpg?k=b96a04e6a22c15bafeaa858a778d8f7aa1d2712551b0dae7cfe648fa261ba8ed&o="
          alt=""
          className="lPropListImg" />
        <span className="lPName">River Hotel</span>
        <span className="lPCity">Manavgat</span>
        <span className="lPPrice">From 100€</span>
        <div className="lPRating">
          <button>6.9</button>
          <span>Fabulous</span>
        </div>
      </div>

      <div className="lPropListItem">
        <img src="https://cf.bstatic.com/xdata/images/hotel/square240/236278226.jpg?k=c2252c2601c3375c5d6d57aedb89c9e81b15353f15519f1542e4905a3019739f&o="
          alt=""
          className="lPropListImg" />
        <span className="lPName">The Sansa Hotel & Spa</span>
        <span className="lPCity">Madrid</span>
        <span className="lPPrice">From 120€</span>
        <div className="lPRating">
          <button>7.8</button>
          <span>Good</span>
        </div>
      </div>

      <div className="lPropListItem">
        <img src="https://cf.bstatic.com/xdata/images/hotel/square240/584637586.jpg?k=180c3fa76ed002da32e63ec404ad6f050794c77419d6cdd0d17768cb0e2ce852&o="
          alt=""
          className="lPropListImg" />
        <span className="lPName">Lusso Sorgun</span>
        <span className="lPCity">Porto</span>
        <span className="lPPrice">From 120€</span>
        <div className="lPRating">
          <button>9.2</button>
          <span>Fabulous</span>
        </div>
      </div>

    </div>
  )

}

export default LoveProperties
