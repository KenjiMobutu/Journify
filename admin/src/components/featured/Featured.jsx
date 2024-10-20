import "./featured.scss";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CallReceivedOutlinedIcon from '@mui/icons-material/CallReceivedOutlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import { useState, useEffect } from "react";
import axios from "axios";

const Featured = () => {
  const token = localStorage.getItem('access_token');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [percentage, setPercentage] = useState(0);
  const [amount, setAmount] = useState(0);
  const [previousAmount, setPreviousAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les ventes d'aujourd'hui
        const { data: todaySales } = await axios.get(`${backendUrl}/api/hotels/todaySales`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        console.log("Today sales: ", todaySales);

        // Récupérer les ventes de la période précédente
        const { data: previousSales } = await axios.get(`${backendUrl}/api/hotels/previousSales`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        console.log("Previous sales: ", previousSales);

        // Mettre à jour les montants
        setAmount(todaySales);
        setPreviousAmount(previousSales);

        // Calcul de la variation en pourcentage
        const variation = previousSales > 0
          ? ((todaySales - previousSales) / previousSales) * 100
          : 0;
        setPercentage(variation.toFixed(2));
      } catch (err) {
        console.error("Error fetching sales data", err);
      }
    };

    fetchData();
  }, [backendUrl, token]);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Revenue</h1>
        <MoreVertIcon className="moreIcon" fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={percentage} text={`${percentage}%`} />
        </div>
        <p className="title">Total sales today</p>
        <p className="amount">{amount}€</p>
        <p className="bottomText">Compared to last period</p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Daily sales</div>
            <div className={`itemResult ${percentage >= 0 ? 'positive' : 'negative'}`}>
              {percentage >= 0 ? (
                <ArrowOutwardOutlinedIcon className="icon" />
              ) : (
                <CallReceivedOutlinedIcon className="icon" />
              )}
              <div className="resultAmount">{amount}€</div>
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">Previous period</div>
            <div className="itemResult">
              <CallReceivedOutlinedIcon className="icon" />
              <div className="resultAmount">{previousAmount}€</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
