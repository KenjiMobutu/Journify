import { useEffect, useRef } from "react";
import "./message.css";

const Message = ({ messages }) => {
  
  const endRef = useRef(null);

  // Défile automatiquement vers le bas lorsqu'il y a de nouveaux messages
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]); //`messages` comme dépendance pour déclencher le scroll sur chaque nouveau message

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chatContainer">
          <div className="chatBox">
            {messages?.map((message, index) => (
              <div
                key={index}
                className={message.sender === "bot" ? "chatLeft" : "chatRight"}
              >
                <div className="chatMessage">
                  <p className="chatText">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
