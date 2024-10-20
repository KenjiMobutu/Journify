import "./chart.scss"
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Chart = ({ aspect, title, token }) => {
  const [data, setData] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/hotels/last6Months`);
        console.log("Last 6 months revenue :", response.data);
        setData(response.data); // Récupérer les données de revenus des 6 derniers mois
      } catch (error) {
        console.error("Erreur lors de la récupération des données de revenus :", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="chart">
      <div className="title">{title || 'Last 6 months revenue'}</div>
      <ResponsiveContainer width="100%" aspect={aspect || 2 / 1}>
        <AreaChart
          width={630}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
