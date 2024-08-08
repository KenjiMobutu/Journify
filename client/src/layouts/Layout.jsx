
import PropTypes from 'prop-types';
import Navbar from "../components/navbar/Navbar";
import Header from "../components/header/Header";
import Footer from "../components/footer/FooterPage";

export const Layout = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <Header/>
      <main className="flex-grow">
        {children}
      </main>
      <Footer/>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
