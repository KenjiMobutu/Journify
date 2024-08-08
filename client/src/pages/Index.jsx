import "./index.css"
import Navbar from "../components/navbar/Navbar";
import Header from "../components/header/Header";
import Featured from "../components/featured/Featured";
import PropertyList from "../components/propertyList/PropertyList";
import Footer from "../components/footer/FooterPage";
import LoveProperties from "../components/loveProperties/loveProperties";
import Newsletter from "../components/newsletter/Newsletter";
export default function Index(){
  return(
    <div>
      <Navbar/>
      <Header/>
      <div className="homeContainer">
        <Featured/>
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList/>
        <h1 className="homeTitle">Accommodations that guests love</h1>
        <LoveProperties/>
        <Newsletter/>
      </div>
      <Footer/>
    </div>
  );
}
