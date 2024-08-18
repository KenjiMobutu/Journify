import "./sidebar.scss"
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link } from 'react-router-dom';
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { useNavigate } from "react-router";
import { AuthenticationContext } from '../../context/AuthenticationContext';
import useFetch from "../../hooks/useFetch";
import { useLocation } from "react-router-dom";


const Sidebar = () => {
  const navigate = useNavigate();
  const { dispatch: darkModeDispatch } = useContext(DarkModeContext); // Renommé pour éviter le conflit
  const { loading, error, dispatch: authDispatch } = useContext(AuthenticationContext); // Renommé pour éviter le conflit
  const { user } = useContext(AuthenticationContext);



  const handleLogout = async () => {
    try {

      // Supprime le token de l'utilisateur du localStorage ou de la session
      localStorage.removeItem('token');
      // Màj du contexte ou l'état global pour refléter que l'utilisateur n'est plus connecté
      authDispatch({ type: 'LOGOUT' });
      // Rediriger l'utilisateur vers la page de connexion ou la page d'accueil
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Journify Admin</span>
      </div>
      <hr />
      <div className="center">
        <ul className="list">
          <p className="title">Main</p>
          <li className="item">
            <Link to="/" className="link">
              <SpaceDashboardOutlinedIcon className="icon" />
              <span>
                Dashbord
              </span>
            </Link>
          </li>
          <p className="title">Manage</p>
          <li className="item">
            <Link to="/users" className="link">
              <PeopleAltOutlinedIcon className="icon" />
              <span>
                Users
              </span>
            </Link>
          </li>
          <li className="item">
            <Link to="/users/new" className="link">
              <PersonAddAltOutlinedIcon className="icon" />
              <span>
                New User
              </span>
            </Link>
          </li>
          <li className="item">
            <Link to="/hotels/" className="link">
              <HotelOutlinedIcon className="icon" />
              <span>
                Hotels
              </span>
            </Link>
          </li>
          <li className="item">
            <Link to="/rooms/" className="link">
              <KingBedOutlinedIcon className="icon" />
              <span>
                Rooms
              </span>
            </Link>
          </li>
          <p className="title">User</p>
          <li className="item">
            <Link to={`/users/${user?._id}`} className="link">
              <AccountCircleOutlinedIcon className="icon" />
              <span>
                Profile
              </span>
            </Link>
          </li>
          <li className="item">
            <ExitToAppIcon className="icon" />
            <span onClick={handleLogout}>
              Logout
            </span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="theme" onClick={() => darkModeDispatch({ type: "LIGHT" })}></div>
        <div className="theme" onClick={() => darkModeDispatch({ type: "DARK" })}></div>
      </div>
    </div>
  )
}

export default Sidebar;
