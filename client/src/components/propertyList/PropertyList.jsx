
import "./propertyList.css"

const PropertyList = () => {
  return (
    <div className="pList">
      <div className="pListItem">
        <img src="https://r-xx.bstatic.com/xdata/images/xphoto/263x210/57584488.jpeg?k=d8d4706fc72ee789d870eb6b05c0e546fd4ad85d72a3af3e30fb80ca72f0ba57&o="
          alt=""
          className="pListImg" />
        <div className="pListTitles">
          <h1>Hotels</h1>
          <h2>344,945 hotels</h2>
        </div>
      </div>
      <div className="pListItem">
        <img src="https://q-xx.bstatic.com/xdata/images/hotel/263x210/119467716.jpeg?k=f3c2c6271ab71513e044e48dfde378fcd6bb80cb893e39b9b78b33a60c0131c9&o="
          alt=""
          className="pListImg" />
        <div className="pListTitles">
          <h1>Apartments</h1>
          <h2>1,123,456 apartments</h2>
        </div>
      </div>
      <div className="pListItem">
        <img src="https://q-xx.bstatic.com/xdata/images/xphoto/263x210/45450084.jpeg?k=f8c2954e867a1dd4b479909c49528531dcfb676d8fbc0d60f51d7b51bb32d1d9&o="
          alt=""
          className="pListImg" />
        <div className="pListTitles">
          <h1>Resorts</h1>
          <h2>44,945 resorts</h2>
        </div>
      </div>
      <div className="pListItem">
        <img src="https://q-xx.bstatic.com/xdata/images/hotel/263x210/100235855.jpeg?k=5b6e6cff16cfd290e953768d63ee15f633b56348238a705c45759aa3a81ba82b&o="
          alt=""
          className="pListImg" />
        <div className="pListTitles">
          <h1>Villas</h1>
          <h2>345,678 villas</h2>
        </div>
      </div>
    </div>
  )
}

export default PropertyList
