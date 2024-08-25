import "./navbar.css"
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);
  console.log(user);
  const {loading, error, dispatch } = useContext(AuthenticationContext);

  const handleLoginClick = () => {
    navigate('/login'); // Redirige vers la route login
  }

  const handleRegisterClick = () => {
    navigate('/register');
  }

  const handleLogout = async () => {
    try {

      // Supprime le token de l'utilisateur du localStorage ou de la session
      localStorage.removeItem('token');
      // Màj du contexte ou l'état global pour refléter que l'utilisateur n'est plus connecté
      dispatch({ type: 'LOGOUT' });
      // Rediriger l'utilisateur vers la page de connexion ou la page d'accueil
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  const handleBookings = () => {
    navigate('/myBookings');
  }

  const handleProfile = () => {
    navigate('/profile/' + user._id);
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <div className="navTitle" id="scroll-text">
          <span>
            <Link to="/">JOURNIFY</Link>
          </span>
        </div>
        {user ? (

          <div>
            <span onClick={handleProfile} className="navName">Welcome, {user.userName}</span>
            <img src={user.img || "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
              alt=""
              className="avatar"
              onClick={handleProfile}
            />
            <button className="navButton" onClick={handleBookings}>My Bookings</button>
            <button className="navButton" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="navItems">
            <button className="navButton" onClick={handleRegisterClick}>Register</button>
            <button className="navButton" onClick={handleLoginClick}>Login</button>
          </div>
        )}
      </div>
    </div>
  )

}

export default Navbar
