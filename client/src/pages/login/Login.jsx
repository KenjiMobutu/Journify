import { useState } from 'react';
import './login.css'
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  console.log(apiUrl);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const {loading, error, dispatch } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setCredentials(previous => ({ ...previous, [e.target.id]: e.target.value }));
  };

  const handleClick = async e => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      const redirectTo = location.state?.from || '/';
      //navigate("/");
      navigate(redirectTo);
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
    }
  };

  return (
    <div className="login">
      <div className='loginContainer'>
        <input type="text" placeholder="username" id='userName' onChange={handleChange} className='loginInput' />
        <input type="password" placeholder="password" id='password' onChange={handleChange} className='loginInput'/>
        <button onClick={handleClick} disabled={loading} className='loginButton'>Login</button>
        {error && <span> {error.message} </span>}
      </div>
    </div>
  );
}


