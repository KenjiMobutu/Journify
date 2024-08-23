import "./index.css"
import Navbar from "../components/navbar/Navbar";
import Header from "../components/header/Header";
import Newsletter from "../components/newsletter/Newsletter";
export default function Index() {
  return (
    <div>
      <Navbar />
      <Header />
      <div className="homeContainer">
        <Newsletter />
      </div>
    </div>
  );
}
