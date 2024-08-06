import "./navbar.css"
import { useNavigate } from 'react-router-dom';



const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Redirige vers la route login
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <span className="logo">JOURNIFY</span>
        <div className="navItems">
          <button className="navButton">Register</button>
          <button className="navButton" onClick={handleLoginClick}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
