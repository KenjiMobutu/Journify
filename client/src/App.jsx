import {BrowserRouter,Routes,Route,} from "react-router-dom";
import Index from './pages/Index';
import Login from './pages/login/Login';
import List from './pages/list/List';
import Hotel from './pages/hotel/Hotel';
import Register from "./pages/register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/hotel" element={<Hotel/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App
