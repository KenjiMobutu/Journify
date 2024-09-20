import { createContext, useState } from "react";


const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [lastMessage, setLastMessage] = useState([""]);
  const [chats, setChats] = useState([]);

  const updateLastMessage = (chatId, lastMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId ? { ...chat, lastMessage } : chat
      )
    );
  };

  return (
    <ChatContext.Provider value={{ selectedChat, setSelectedChat,lastMessage, setLastMessage, chats, setChats, updateLastMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
