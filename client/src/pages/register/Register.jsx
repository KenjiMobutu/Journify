import { useState } from 'react';
import './register.css'; // Assurez-vous que le chemin d'accès est correct
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { io } from "socket.io-client";

const Register = () => {
  const socket = io("http://localhost:3000")
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    if (userData.password !== userData.confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }

    if (userData.userName.length < 3) {
      setErrors(['Username must be at least 3 characters']);
      return;
    }

    if (userData.password.length < 3) {
      setErrors(['Password must be at least 3 characters']);
      return;
    }

    if (userData.email.length < 3) {
      setErrors(['Email must be at least 3 characters']);
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/register', userData);
      socket?.emit("notificationRegister", userData.userName);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors.map(err => err.msg));
      } else {
        console.error('Registration failed:', error);
        setErrors(['Registration failed']);
      }
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <h1 className='title'>Create Your Account</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label htmlFor="userName">Username</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={userData.userName}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => <p key={index}>{error}</p>)}
        </div>
      )}

      <Link to="/" className="home-btn-link">
        <button className="home-btn">Home</button>
      </Link>
    </div>
  );
};

export default Register;
