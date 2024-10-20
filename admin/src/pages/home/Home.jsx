import { useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";
import { AuthenticationContext } from '../../context/AuthenticationContext';
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Datatable from "../../components/datatable/Datatable";
import "./home.scss";

const Home = ({ columns, title }) => {
  const token = localStorage.getItem('access_token');
  const { user } = useContext(AuthenticationContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", { transports: ['websocket'] });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Déconnecter le socket lors du démontage du composant
    };
  }, []);

  useEffect(() => {
    if (socket && user?.userName) {
      socket.emit("newUser", user.userName);
    }
  }, [socket, user?.userName]);

  return (
    <div className="home">
      <Sidebar className="sideHome"/>
      <div className="homeContainer">
        <Navbar socket={socket} token={token}/>
        <div className="widgets">
          <Widget type="user" token={token}/>
          <Widget type="night" token={token}/>
          <Widget type="room" token={token}/>
          <Widget type="booking" token={token}/>
          <Widget type="balance" token={token}/>
        </div>
        <div className="charts">
          <Featured token={token}/>
          <Chart token={token}/>
        </div>
        <div className="listContainer">
          <div className="listTitle">Bookings</div>
          <Datatable columns={columns} title={title} token={token}/>
        </div>
      </div>
    </div>
  );
};

export default Home;
