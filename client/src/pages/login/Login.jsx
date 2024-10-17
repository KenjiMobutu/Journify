import { useState } from 'react';
import './login.css'
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../../redux/authRedux.js';
import { useDispatch } from "react-redux";
import { setupStore } from '../../redux/store';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

export default function Login({ socket }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // État pour gérer l'affichage du mot de passe
  const { loading, error, dispatch } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);

  const dis = useDispatch();

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    dis(loginStart());
    try {
      //const res = await axios.post(`/api/auth/login`, credentials, { withCredentials: true });
      const res = await axios.post(`${apiUrl}/api/auth/login`, credentials, {withCredentials: true});
      const userId = res.data.details._id;
      localStorage.setItem('userId', userId);
      setupStore(userId);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      dis(loginSuccess({ userId: res.data.details._id }));
      socket.emit('loginUser', res.data.details._id, res.data.details.userName,res.data.details);
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
      window.location.reload();
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
      dis(loginFailure(error.response?.data || "An error occurred"));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Inverse l'état d'affichage du mot de passe
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginTop">
          <AccountCircle className="loginIcon" />
          <h1 className="loginTitle">SIGN IN</h1>
          <p className="loginSubTitle">Welcome user, please sign in to continue</p>
        </div>
        <form className="loginForm" onSubmit={handleClick}>
          <input
            type="text"
            placeholder="Username"
            id="userName"
            value={credentials.userName}
            onChange={(e) => setCredentials({ ...credentials, userName: e.target.value })}
            className="loginInputUsername"
          />
          <div className="passwordField">
            <input
              type={showPassword ? "text" : "password"} // Bascule entre texte et mot de passe
              placeholder="Password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="loginInputPassword"
            />
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          </div>
          <button type="submit" disabled={loading} className="loginButton">
            Login
          </button>
          {error && <span className="loginError">{error.message}</span>}
        </form>
        <button onClick={() => navigate('/register')} disabled={loading} className="loginRegisterButton">
          Register
        </button>
      </div>
    </div>
  );
}
