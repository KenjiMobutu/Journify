import "./chatList.css";
import { useContext, useState, useEffect } from "react";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import ChatContext from "../../../context/ChatContext.jsx";
import minus from '../../../assets/minus.png';
import plus from '../../../assets/plus.png';
import search from '../../../assets/search.png';
import AddUser from "./addUser/AddUser";
import avatar from '../../../assets/nobody.png';
import axios from "axios";
import { useDispatch } from "react-redux";
import { selectChat } from "../../../redux/chatRedux.js";

const ChatList = ({userFriends}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [addMode, setAddMode] = useState(false);
  const { user } = useContext(AuthenticationContext);
  const { chats, setSelectedChat, setChats } = useContext(ChatContext);
  console.log(userFriends);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // const response = await fetch(`/api/users/userFriends/${user._id}`);
        // const data = await response.json();
        if (!userFriends || userFriends.length === 0) {
          console.log("No user friends available");
          return;
        }
        const items = userFriends; // Récupérer les amis de l'utilisateur
        console.log(items);
        const promises = items.map(async (item) => {
          const friendId = item.user._id === user._id ? item.friend._id : item.user._id;

          // Fetch the friend's data
          const userResponse = await fetch(`/api/users/${friendId}`);
          const usr = await userResponse.json();

          // Fetch messages for this chat
          const messagesResponse = await axios.get(`/api/users/findUserChat/${user._id}/${friendId}`);
          const messages = messagesResponse.data.messages;

          // Get the last message if exists and its timestamp
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : { content: "Aucun message", createdAt: 0 };

          // Return the item with the friend data and the last message
          return { ...item, friend: usr, lastMessage: lastMessage.content, lastMessageTime: lastMessage.createdAt };
        });

        const chatData = await Promise.all(promises);

        // Trier les chats par l'horodatage du dernier message immédiatement après récupération
        chatData.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        // Mettre à jour l'état avec les chats triés
        setChats(chatData);
      } catch (err) {
        console.error("Erreur lors du chargement des chats:", err);
      }
    };
    fetchChats();
  }, [user._id, setChats, userFriends]);

  const filteredChats = chats?.filter((c) =>
    c?.friend?.userName?.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = (chat) => {
    // Marquer un chat comme vu
    const updatedChats = chats.map((item) => {
      if (item._id === chat._id) {
        return { ...item, isSeen: true };
      }
      return item;
    });

    // Trier les chats après sélection du chat (optionnel)
    updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    dispatch(selectChat(chat));
    setSelectedChat(chat);
    setChats(updatedChats);
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src={search} alt="" />
          <input
            type="text"
            placeholder="Rechercher"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? minus : plus}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats?.map((chat) => (
        <div
          className={`item ${!chat.isSeen ? 'unread' : ''}`}
          key={chat.chatId || chat.friend._id}
          onClick={() => handleSelect(chat)}
        >
          <img
            src={
              chat.friend.blocked?.includes(user._id)
                ? avatar
                : chat.friend.img || avatar
            }
            alt="friend avatar"
          />
          <div className="texts">
            <span>
              {chat.friend.blocked?.includes(user._id)
                ? "Utilisateur"
                : chat.friend.userName}
            </span>
            <p>{chat.lastMessage}</p> {/* Afficher le dernier message ici */}
          </div>
          {!chat.isSeen && <div className="unread-indicator"></div>}
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
