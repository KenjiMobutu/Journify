import "./carRental.css"
import Navbar from "../../components/navbar/Navbar"

const CarRental = ({socket}) => {
  return (
    <div className="CarRental">
      <Navbar socket={socket}/>
      <div className="CarRentalContainer">
        CarRental
      </div>
    </div>
  )
}

export default CarRental
