import "./navbar.css"
import { Link, useNavigate } from 'react-router-dom';



const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Redirige vers la route login
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <div>
          <span className="text-3xl text-pink font-bold tracking-tight">
            <Link to="/">JOURNIFY</Link>
          </span>
        </div>
        <div className="navItems">
          <button className="navButton">Register</button>
          <button className="navButton" onClick={handleLoginClick}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
