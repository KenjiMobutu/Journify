import "./navbar.css"
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import axios from 'axios';




const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);
  const {loading, error, dispatch } = useContext(AuthenticationContext);
  const handleLoginClick = () => {
    navigate('/login'); // Redirige vers la route login
  }
  const handleRegisterClick = () => {
    navigate('/register');
  }

  const handleLogout = async () => {
    try {
      //await axios.post('/api/auth/logout'); // Appel à l'API pour déconnecter l'utilisateur
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

  return (
    <div className="navbar">
      <div className="navContainer">
        <div>
          <span className="text-3xl text-pink font-bold tracking-tight">
            <Link to="/">JOURNIFY</Link>, the new BAAANGER!
          </span>
        </div>
        {user ? (
          <div>
            <span>Welcome, {user.userName}</span>
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
