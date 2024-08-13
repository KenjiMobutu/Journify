import "./widget.scss"
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';

const Widget = ({ type  }) => {
  let data;
  const amount = Math.floor(Math.random() * 1000) + 500;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        count: "1234",
        isMoney: false,
        link: "All Users",
        percentage: "+2.5%",
        icon: (
          <PersonOutlineOutlinedIcon className="icon"
          style={{backgroundColor: "#f7047560", color: "#f70476"}}
          />)
      }
      break;
    case "hotel":
      data = {
        title: "HOTELS",
        count: "1234",
        isMoney: false,
        link: "All Hotels",
        percentage: "+2.5%",
        icon: (
        <HomeOutlinedIcon className="icon"
        style={{backgroundColor: "#f7960460", color: "orange"}}
        />)
      }
      break;
    case "room":
      data = {
        title: "ROOMS",
        count: "1234",
        isMoney: false,
        link: "All Rooms",
        percentage: "+2.5%",
        icon: (
        <KingBedOutlinedIcon className="icon"
        style={{backgroundColor: "#04f71460", color: "green"}}
        />)
      }
      break;
    case "booking":
      data = {
        title: "BOOKINGS",
        count: "1234",
        isMoney: false,
        link: "All Bookings",
        percentage: "+2.5%",
        icon: (
        <BookOnlineOutlinedIcon className="icon"
        style={{backgroundColor: "#f7040460", color: "#f70404"}}
        />)
      }
      break;
    case "balance":
      data = {
        title: "BALANCE",
        count: "1234",
        isMoney: true,
        link: "All Transactions",
        percentage: "+2.5%",
        icon: (
        <EuroOutlinedIcon className="icon"
        style={{backgroundColor: "lightblue", color: "blue"}}
        />)
      }
      break;
      default:
        break;
  }


  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{amount} {data.isMoney && "€"} </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <ArrowOutwardOutlinedIcon />
          <span className="text">{data.percentage }</span>
        </div>
        {data.icon}

      </div>
    </div>
  )
}

export default Widget
