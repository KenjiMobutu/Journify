import "./navbar.scss"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ContrastOutlinedIcon from '@mui/icons-material/ContrastOutlined';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search here..." />
          <SearchOutlinedIcon className="icon"/>
        </div>
        <div className="items">
          <div className="item">
            <PublicOutlinedIcon className="icon"/>
            <span>English</span>
          </div>
          <div className="item">
            <NotificationsOutlinedIcon className="icon"/>
            <div className="counter">5</div>
          </div>
          <div className="item">
            <ContrastOutlinedIcon className="icon"/>
          </div>
          <div className="item">
            <img
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt=""
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
