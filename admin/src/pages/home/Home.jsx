import Chart from "../../components/chart/Chart"
import Featured from "../../components/featured/Featured"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Widget from "../../components/widget/Widget"
import Datatable from "../../components/datatable/Datatable"
import "./home.scss"
import { io } from "socket.io-client";
import { useEffect, useContext, useState } from "react";
import { AuthenticationContext } from '../../context/AuthenticationContext';

const Home = ({ columns, title }) => {

  const { user } = useContext(AuthenticationContext);
  //const { data } = useFetch(`/api/users/${user?._id}`);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:3000"));
  }, [])

  useEffect(() => {
    socket?.emit("newUser", user.userName);
  }, [socket, user.userName]);


  return (
    <div className="home">
      <Sidebar />
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
          <div className="listTitle">Latest users added</div>
          <Datatable columns={columns} title={title} />
        </div>
      </div>
    </div>
  )
}

export default Home
