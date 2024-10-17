import "./navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import axios from 'axios';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Badge from '@mui/material/Badge';
import * as React from 'react';
import Box from '@mui/material/Box';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AirplaneTicketOutlinedIcon from '@mui/icons-material/AirplaneTicketOutlined';
import { useSelector } from 'react-redux';
import { usePersistor } from '../../context/PersistorContext.jsx';
import { logout } from '../../redux/authRedux.js';
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { addNotification, incrementQuantity, decrementQuantity, setNotif, clearNotif, clearNotifications } from "../../redux/notifRedux.js";
import PropTypes from 'prop-types';
import { useCallback } from "react";



const Navbar = ({ socket }) => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const persistor = usePersistor();
  const { user, dispatch } = useContext(AuthenticationContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('access_token');
  const dis = useDispatch();

  const notifications = useSelector((state) => state.notif.notifications);
  console.log('Notifications:', notifications);

  // états distincts pour chaque menu
  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const openAccount = Boolean(anchorElAccount);
  const openNotifications = Boolean(anchorElNotifications);

  const handleAccountClick = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorElAccount(null);
  };

  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  const handleLoginClick = () => {
    navigate('/login'); // Redirige vers la route login
  }

  const handleRegisterClick = () => {
    navigate('/register');
  }

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(`/api/users/${user._id}`);
        setIsAdmin(response.data.isAdmin);
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
      dispatch(logout()); // Réinitialiser l'état d'authentification
      Cookies.remove('access_token');
      await persistor.purge(); // Supprimer les données de l'utilisateur du stockage local
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  const handleClearNotif = () => {
    dis(clearNotifications());
  }

  const handleBookings = () => {
    navigate('/myBookings');
  }

  const handleProfile = () => {
    navigate(`/profile/${user._id}`);
  }

  const handleAddUser = () => {
    navigate('/friends');
  };

  const quantity = useSelector((state) => state.cart.quantity);
  const notificationsQuantity = useSelector((state) => state.notif.quantity);
  const handleNotificationClick = (notif) => {
    if (notif.content.includes("message")) {
      navigate("/friends");
    }

    if (notif.content.includes("booking")) {
      navigate("/myBookings");
    }

  };
  useEffect(() => {
    const handleNotification = (data) => {
      console.log('Received notification:', data);
      dis(addNotification(data));
      dis(incrementQuantity()); // Incrémente le compteur de notifications
    };
    console.log('Socket:', socket);
    if (socket) {
      socket.on('notification', handleNotification);
    }

    return () => {
      if (socket) {
        socket.off('notification', handleNotification); // Nettoie l'écouteur de notification
      }
    };
  }, [socket, dis]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('loginUser', user._id, user.userName);
    }
  }, [socket, user]);

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
            <span className="navName">Welcome, {user.userName}</span>

            {/* Avatar et Menu Compte */}
            <React.Fragment>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleAccountClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={openAccount ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openAccount ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 42, height: 42 }}>
                      <img src={user.img || "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                        alt=""
                        className="avatar"
                      />
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorElAccount}
                id="account-menu"
                open={openAccount}
                onClose={handleAccountClose}
                onClick={handleAccountClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfile}>
                  <AccountCircleOutlinedIcon className="accountIcon" /> Profile
                </MenuItem>
                <MenuItem onClick={handleBookings}>
                  <AirplaneTicketOutlinedIcon className="bookingTickets" /> My bookings
                </MenuItem>
                <MenuItem onClick={handleAddUser}>
                  <PersonAddAltOutlinedIcon className="bookingTickets" /> Add a friend
                </MenuItem>
                <Divider />
                {isAdmin && (
                  <MenuItem onClick={() => window.location.href = 'http://localhost:8000'}  >
                    <Settings className="bookingTickets" />
                    Admin
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </React.Fragment>

            {/* Notifications */}
            <React.Fragment>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Notifications">
                  <IconButton
                    onClick={handleNotificationsClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={openNotifications ? 'notifications' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openNotifications ? 'true' : undefined}
                  >
                    <Badge
                      badgeContent={notificationsQuantity}
                      color="primary"
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      className="badgeNotif"
                    >
                      <NotificationsOutlinedIcon className="notifications" style={{ fontSize: 32, color: 'white' }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorElNotifications}
                id="notifications"
                open={openNotifications}
                onClose={handleNotificationsClose}
                onClick={handleNotificationsClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* Afficher les notifications */}
                {notifications.length > 0 ? (
                  <>
                    {notifications
                      .slice()
                      .reverse()
                      .map((notif, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          {notif.content || notif.message||notif.userName||notif }
                        </MenuItem>
                      ))}
                    <MenuItem>
                      <button onClick={handleClearNotif}>Clear notifications</button>
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem>Aucune nouvelle notification</MenuItem>
                )}

              </Menu>
            </React.Fragment>

            <Link to="/cart" >
              <Badge badgeContent={quantity} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right', }}>
                <ShoppingCartOutlinedIcon className="shoppingCart" style={{ fontSize: 32 }} />
              </Badge>
            </Link>


          </div>
        ) : (
          <div className="navItems">
            <button className="navButton" onClick={handleRegisterClick}>Register</button>
            <button className="navButton" onClick={handleLoginClick}>Login</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
