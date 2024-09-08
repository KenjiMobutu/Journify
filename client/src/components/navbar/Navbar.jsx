import "./navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import axios from 'axios';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Badge from '@mui/material/Badge';
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AirplaneTicketOutlinedIcon from '@mui/icons-material/AirplaneTicketOutlined';

const Navbar = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthenticationContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('access_token');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        console.log("Admin status:", response.data.isAdmin);
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
  }

  const handleBookings = () => {
    navigate('/myBookings');
  }

  const handleProfile = () => {
    navigate(`/profile/${user._id}`);
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
            <span className="navName">Welcome, {user.userName}</span>
            <React.Fragment>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
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
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 36,
                        height: 36,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 24,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfile}>
                  <Avatar /> Profile
                </MenuItem>
                <MenuItem onClick={handleBookings}>
                  <AirplaneTicketOutlinedIcon className="bookingTickets"/> My bookings
                </MenuItem>
                <Divider />

                {isAdmin && (
                  <MenuItem onClick={() => navigate('/admin')} >
                    <Settings className="bookingTickets"/>
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

            <Link to="/cart" >
              <Badge badgeContent={4} color="primary">
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
