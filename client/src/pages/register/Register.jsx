import { useState, useEffect } from 'react';
import './register.css'; // Assurez-vous que le chemin d'accès est correct
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

const Register = ({ socket }) => {
  const { id } = useParams(); // Récupère l'ID de l'utilisateur depuis l'URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: 'false'
  });

  // Charger les données de l'utilisateur si un ID est présent
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/users/${id}`);
          setUserData({ ...response.data, confirmPassword: response.data.password });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [id]);

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

    // Validation des données
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
      if (id) {
        // Mise à jour de l'utilisateur existant
        await axios.put(`/api/users/${id}`, userData);
        socket?.emit("notificationUpdate", userData.userName);
      } else {
        // Création d'un nouvel utilisateur
        await axios.post('/api/auth/register', userData);
        socket?.emit("notificationRegister", userData.userName);
      }
      navigate('/'); // Rediriger vers la page d'accueil après l'inscription
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors.map(err => err.msg));
      } else {
        console.error('Submission failed:', error);
        setErrors(['Submission failed']);
      }
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <h1 className='title'>{id ? 'Update User' : 'Create Your Account'}</h1>
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

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? (id ? 'Updating...' : 'Registering...') : (id ? 'Update' : 'Register')}
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
