import "./index.css"
import Navbar from "../components/navbar/Navbar";
import Header from "../components/header/Header";
import Newsletter from "../components/newsletter/Newsletter";
import ia from '../../src/assets/ia.gif';
import { useState } from "react";
import Chat from "../components/chat/Chat";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";

export default function Index({ socket }) {
  const [openAi, setOpenAi] = useState(false);
  const { user } = useContext(AuthenticationContext);


  return (
    <div>
      <div className="homeContainer">
        <Navbar socket={socket} />
        <Header />
        <Newsletter />
        {user && (
          <div className="iaChat">
            <button className="iaChatBtn" onClick={() => setOpenAi(!openAi)}>
              <img src={ia} alt="ia" className="iaBot" />
            </button>
          </div>
        )}
      </div>
      {/* Chat s'ouvre ici */}
      {openAi && <Chat setOpen={setOpenAi} />}
    </div>
  );
}
