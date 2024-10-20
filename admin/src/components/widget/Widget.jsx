import "./widget.scss";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const Widget = ({ type}) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('access_token');
  const [users, setUsers] = useState(0);
  const [nights, setNights] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [amount, setAmount] = useState(0);
  const [percentage, setPercentage] = useState(0); // Pourcentage de variation

  useEffect(() => {
    const fetchData = async () => {
      let currentValue = 0;
      let previousValue = 0;

      if (type === "user") {
        const response = await axios.get(`${backendUrl}/api/users`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });
        currentValue = response.data.length;
        previousValue = await getPreviousValue(`${backendUrl}/api/users`, "user",
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        setUsers(currentValue);
      }

      if (type === "night") {
        const response = await axios.get(`${backendUrl}/api/hotels/bookings`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        currentValue = response.data.reduce((acc, booking) => {
          const checkInDate = new Date(booking.checkIn);
          const checkOutDate = new Date(booking.checkOut);
          const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
          const nights = timeDifference / (1000 * 3600 * 24);
          return acc + nights;
        }, 0);
        previousValue = await getPreviousValue(`${backendUrl}/api/hotels/bookings`, "night",
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        setNights((currentValue).toFixed(0));
      }

      if (type === "room") {
        const response = await axios.get(`${backendUrl}/api/hotels/bookings`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        currentValue = response.data.reduce((acc, booking) => acc + booking.rooms, 0);
        previousValue = await getPreviousValue(`${backendUrl}/api/hotels/bookings`, "room",
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        setRooms(currentValue);
      }

      if (type === "booking") {
        const response = await axios.get(`${backendUrl}/api/hotels/bookings`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        currentValue = response.data.length;
        previousValue = await getPreviousValue(`${backendUrl}/api/hotels/bookings`, "booking",
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        setBookings(currentValue);
      }

      if (type === "balance") {
        const response = await axios.get(`${backendUrl}/api/hotels/bookings`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        console.log("Balance :", response.data);
        currentValue = response.data.reduce((acc, booking) => acc + booking.totalCost, 0);
        previousValue = await getPreviousValue(`${backendUrl}/api/hotels/bookings`, "balance",
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        setAmount(currentValue);
      }

      // Calculer le pourcentage de variation
      const variation = ((currentValue - previousValue) / previousValue) * 100;
      setPercentage(variation.toFixed(2));
    };

    fetchData();
  }, [backendUrl, token, type]);

  // Simule la récupération des valeurs précédentes (peut être une API réelle)
  const getPreviousValue = async (url, type) => {
    // Simuler la récupération de la valeur précédente
    return type === "user" ? 90 : 100; // Exemple de valeur précédente
  };

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
        percentage: `${percentage}%`,
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
        percentage: `${percentage}%`,
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
        percentage: `${percentage}%`,
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
        percentage: `${percentage}%`,
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
        percentage: `${percentage}%`,
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
        <div className={`percentage ${percentage >= 0 ? 'positive' : 'negative'}`}>
        {percentage >= 0 ? <NorthOutlinedIcon /> : <SouthOutlinedIcon />}
          <span className="text">{data.percentage}</span>
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
