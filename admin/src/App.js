import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import New from "./pages/new/New";
import NewHotel from "./pages/newHotel/NewHotel";
import NewRoom from "./pages/newRoom/NewRoom";
import Single from "./pages/single/Single";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "./style/dark.scss";
import { io } from "socket.io-client";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthenticationContext } from "./context/AuthenticationContext";
import { hotelColumns, roomColumns, userColumns, bookingsColumns } from "./dataTableSource";
import { userInputs, hotelInputs, roomInputs } from "./formSource";
import { useState, useEffect } from "react";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", { transports: ['websocket'] });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Déconnecter le socket lors du démontage du composant
    };
  }, []);

  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    const {user} = useContext(AuthenticationContext);

    if(!user){
      return <Navigate to="/login"/>;
    }
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" >
            <Route path="login" element={<Login/>}/>
            <Route index element={
              <ProtectedRoute>
                <Home columns={ bookingsColumns} />
              </ProtectedRoute>
            }/>
            <Route path="users">
              <Route index element={<ProtectedRoute><List columns={ userColumns} title="Users"/></ProtectedRoute>}/>
              <Route path="new" element={<ProtectedRoute><New inputs={userInputs} title="Add New User"/></ProtectedRoute>}/>
              <Route path="new/:id" element={<ProtectedRoute><New inputs={userInputs} title="Update User"/></ProtectedRoute>}/>
              <Route path=":id" element={<ProtectedRoute><Single socket={socket} /></ProtectedRoute>}/>
            </Route>
            <Route path="hotels">
              <Route index element={<ProtectedRoute><List columns={hotelColumns} title="Hotels"/></ProtectedRoute>}/>
              <Route path="new" element={<ProtectedRoute><NewHotel inputs={hotelInputs} title="Add New Hotel"/></ProtectedRoute>}/>
              <Route path=":id" element={<ProtectedRoute><Single socket={socket} /></ProtectedRoute>}/>
            </Route>
            <Route path="rooms">
              <Route index element={<ProtectedRoute><List columns={roomColumns} title="Rooms"/></ProtectedRoute>}/>
              <Route path="new" element={<ProtectedRoute><NewRoom inputs={roomInputs}  title="Add New Room"/></ProtectedRoute>}/>
              <Route path=":id" element={<ProtectedRoute><Single socket={socket} /></ProtectedRoute>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
