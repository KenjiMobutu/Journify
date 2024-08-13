import "./sidebar.scss"
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link } from 'react-router-dom';
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";

const Sidebar = () => {

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Journify Admin</span>
      </div>
      <hr/>
      <div className="center">
        <ul className="list">
          <p className="title">Main</p>
          <li className="item">
            <Link to="/" className="link">
              <SpaceDashboardOutlinedIcon className="icon"/>
              <span>
                Dashbord
              </span>
            </Link>
          </li>
          <p className="title">Manage</p>
          <li className="item">
            <Link to="/users" className="link">
              <PeopleAltOutlinedIcon className="icon"/>
              <span>
                Users
              </span>
            </Link>
          </li>
          <li className="item">
            <Link to="/users/new" className="link">
              <PersonAddAltOutlined className="icon"/>
              <span>
                New User
              </span>
            </Link>
          </li>
          <li className="item">
            <HotelOutlinedIcon className="icon"/>
            <span>
              Hotels
            </span>
          </li>
          <li className="item">
            <KingBedOutlinedIcon className="icon"/>
            <span>
              Rooms
            </span>
          </li>
          <p className="title">User</p>
          <li className="item">
            <AccountCircleOutlinedIcon className="icon"/>
            <span>
              Profile
            </span>
          </li>
          <li className="item">
            <ExitToAppIcon className="icon"/>
            <span>
              Logout
            </span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="theme"></div>
        <div className="theme"></div>
      </div>
    </div>
  )
}

export default Sidebar
