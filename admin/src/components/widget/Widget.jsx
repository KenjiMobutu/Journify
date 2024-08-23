import "./widget.scss";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


const Widget = ({ type }) => {
  const [users, setUsers] = useState(0);
  const [nights, setNights] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (type === "user") {
      axios.get("/api/users")
        .then(response => {
          setUsers(response.data.length);
        })
        .catch(error => {
          console.error("Error fetching users count:", error);
        });
    }
    if (type === "night") {
      axios.get("/api/hotels/bookings")
        .then(response => {
          const totalNights = response.data.reduce((acc, booking) => {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);

            // Calculer la différence en temps entre les deux dates
            const timeDifference = checkOutDate.getTime() - checkInDate.getTime();

            // Convertir la différence de temps en jours (1 jour = 86400000 ms)
            const nights = timeDifference / (1000 * 3600 * 24);

            // Ajouter le nombre de nuits au total
            return acc + nights;
          }, 0);

          setNights(totalNights);

        })
        .catch(error => {
          console.error("Error fetching nights count:", error);
        });
    }

    if (type === "room") {
      axios.get("/api/hotels/bookings")
        .then(response => {
          const totalRooms = response.data.reduce((acc, booking) => acc + booking.rooms, 0);
          setRooms(totalRooms);

        })
        .catch(error => {
          console.error("Error fetching balance amount:", error);
        });

    }
    if (type === "booking") {
      axios.get("/api/hotels/bookings")
        .then(response => {
          setBookings(response.data.length);

        })
        .catch(error => {
          console.error("Error fetching bookings count:", error);
        });
    }
    if (type === "balance") {
      axios.get("/api/hotels/bookings")
        .then(response => {
          const totalAmount = response.data.reduce((acc, booking) => acc + booking.totalCost, 0);
          setAmount(totalAmount);

        })
        .catch(error => {
          console.error("Error fetching balance amount:", error);
        });
    }

  }, [type]);

  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        count: users,
        isMoney: false,
        link: (
          <Link to="/users" className="link">
            View All Users
          </Link>
        ),
        percentage: "+2.5%",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{ backgroundColor: "#f7047560", color: "#f70476" }}
          />
        ),
      };
      break;
    case "night":
      data = {
        title: "NIGHTS",
        count: nights,
        isMoney: false,
        link: "All Hotels",
        percentage: "+2.5%",
        icon: (
          <HomeOutlinedIcon
            className="icon"
            style={{ backgroundColor: "#f7960460", color: "orange" }}
          />
        ),
      };
      break;
    case "room":
      data = {
        title: "ROOMS",
        count: rooms,
        isMoney: false,
        link: "All Rooms",
        percentage: "+2.5%",
        icon: (
          <KingBedOutlinedIcon
            className="icon"
            style={{ backgroundColor: "#04f71460", color: "green" }}
          />
        ),
      };
      break;
    case "booking":
      data = {
        title: "BOOKINGS",
        count: bookings,
        isMoney: false,
        link: "All Bookings",
        percentage: "+2.5%",
        icon: (
          <BookOnlineOutlinedIcon
            className="icon"
            style={{ backgroundColor: "#f7040460", color: "#f70404" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        count: amount,
        isMoney: true,
        link: "All Transactions",
        percentage: "+2.5%",
        icon: (
          <EuroOutlinedIcon
            className="icon"
            style={{ backgroundColor: "lightblue", color: "blue" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.count} {data.isMoney && "€"}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <ArrowOutwardOutlinedIcon />
          <span className="text">{data.percentage}</span>
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
