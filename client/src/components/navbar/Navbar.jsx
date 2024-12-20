import "./navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import axios from 'axios';

const Navbar = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthenticationContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('access_token');

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        setIsAdmin(response.data.isAdmin);
        console.log("Admin status:", response.data.isAdmin);
      } catch (error) {
        console.error("Failed to fetch admin status:", error);
      }
    };

    if (user) {
      fetchAdminStatus();
    }
  }, [user, apiUrl]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleBookings = () => {
    navigate('/myBookings');
  };

  const handleProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <div className="navTitle">
          <span>
            <Link to="/">JOURNIFY</Link>
          </span>
        </div>

        {/* Bouton hamburger visible uniquement sur petits écrans */}
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={`navItems ${menuOpen ? 'active' : ''}`}>
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
              {isAdmin && (
                <button className="navButton" onClick={() => navigate('/admin')}>Admin</button>
              )}
            </div>
          ) : (
            <>
              <button className="navButton" onClick={handleRegisterClick}>Register</button>
              <button className="navButton" onClick={handleLoginClick}>Login</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
