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


export default function Login() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  console.log(apiUrl);
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const { loading, error, dispatch } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const dis = useDispatch();

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    dis(loginStart());
    console.log(credentials);
    try {
      //const res = await axios.post(`${apiUrl}/api/auth/login`, credentials, {withCredentials: true}); //Production
      const res = await axios.post(`/api/auth/login`, credentials, { withCredentials: true });
      console.log(res.data.details._id);
      const userId = res.data.details._id;

      // Stocker l'ID utilisateur dans localStorage
      localStorage.setItem('userId', userId);
      setupStore(userId);
      console.log(localStorage.getItem('userId'));
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      dis(loginSuccess({ userId: res.data.details._id }));
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
      window.location.reload();
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
      dis(loginFailure(error.response?.data || "An error occurred"));
    }
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
            className="loginInput"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="loginInput"
          />
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


