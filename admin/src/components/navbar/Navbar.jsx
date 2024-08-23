import "./navbar.scss";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { AuthenticationContext } from '../../context/AuthenticationContext';

const Navbar = ({ socket }) => {
  const { darkMode, dispatch } = useContext(DarkModeContext);
  const { user } = useContext(AuthenticationContext);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket?.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  console.log(notifications);

  const handleClear = () => {
    setNotifications([]);
    setOpen(false);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search here..." />
          <SearchOutlinedIcon className="icon" />
        </div>
        <div className="items">
          <div className="item">
            {open && (
              <div className="notifications">
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((n, index) => (
                      <span key={index} className="notification">{n}</span>
                    ))}
                    <button className="notButton" onClick={handleClear}>Clear</button>
                  </>
                ) : (
                  <span className="noNotifications">No notifications</span>
                )}
              </div>
            )}
            <NotificationsOutlinedIcon className="iconNotif" onClick={() => setOpen(!open)} />
            {notifications.length > 0 && (
              <div className="counter">{notifications.length}</div>
            )}
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
            <span>Welcome, {user?.userName}</span>
            <img src={user.img || "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
              alt=""
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
