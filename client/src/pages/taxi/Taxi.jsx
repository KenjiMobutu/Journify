import TaxiPage from '../../components/taxi/Taxi'
import Navbar from '../../components/navbar/Navbar'


const Taxi = ({socket}) => {
  return (
    <>
      <Navbar socket={socket}/>
      <TaxiPage />
    </>
  )
}

export default Taxi
