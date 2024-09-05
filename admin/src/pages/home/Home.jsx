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
        <Navbar socket={socket} />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="night" />
          <Widget type="room" />
          <Widget type="booking" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart />
        </div>
        <div className="listContainer">
          <div className="listTitle">Bookings</div>
          <Datatable columns={columns} title={title} />
        </div>
      </div>
    </div>
  );
};

export default Home;
