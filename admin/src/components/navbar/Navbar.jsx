import "./navbar.scss"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import useFetch from "../../hooks/useFetch";

const Navbar = () => {
  const { darkMode, dispatch } = useContext(DarkModeContext);
  const { user } = useContext(AuthenticationContext);
  const { data } = useFetch(`/api/users/${user?._id}`);

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search here..." />
          <SearchOutlinedIcon className="icon" />
        </div>
        <div className="items">
          <div className="item">
            <PublicOutlinedIcon className="icon" />
            <span>English</span>
          </div>
          <div className="item">
            <NotificationsOutlinedIcon className="icon" />
            <div className="counter">5</div>
          </div>
          <div className="item">
            {darkMode ? (
              <LightModeOutlinedIcon
                className="icon"
                onClick={() => dispatch({ type: "TOGGLE" })}
              />
            ) : (
              <DarkModeOutlinedIcon
                className="icon"
                onClick={() => dispatch({ type: "TOGGLE" })}
              />
            )}
          </div>
          <div className="item">
            <img src={data.img || "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
              alt=""
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
