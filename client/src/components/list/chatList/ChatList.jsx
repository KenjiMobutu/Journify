import "./chatList.css";
import { useContext, useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import ChatContext from "../../../context/ChatContext.jsx";
import minus from '../../../assets/minus.png';
import plus from '../../../assets/plus.png';
import search from '../../../assets/search.png';
import AddUser from "./addUser/AddUser";
import nobody from '../../../assets/nobody.png';
import groupIcon from '../../../assets/group.png';
import axios from "axios";
import { useDispatch } from "react-redux";
import { selectChat } from "../../../redux/chatRedux.js";
import { selectGroup } from "../../../redux/chatRedux.js";



const ChatList = ({ userFriends, fetchUserFriends, groups }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [addMode, setAddMode] = useState(false);
  const { user } = useContext(AuthenticationContext);
  const { chats, setSelectedChat, setChats } = useContext(ChatContext);
  console.log(userFriends);
  console.log(groups);

  const fetchChats = useCallback(async () => {
    console.log("Fetching chats...");
    try {
      const items = userFriends;
      const promises = items?.map(async (item) => {
        console.log("Item:", item);
        const friendId = item.friend._id;
        const userResponse = await fetch(`/api/users/${friendId}`);
        const usr = await userResponse.json();
        const messagesResponse = await axios.get(`/api/users/findUserChat/${user._id}/${friendId}`);
        const messages = messagesResponse.data.messages;
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : { content: "Aucun message", createdAt: 0 };
        return { ...item, friend: usr, lastMessage: lastMessage.content, lastMessageTime: lastMessage.createdAt };
      });
      const chatData = await Promise.all(promises);
      chatData.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      setChats(chatData);
    } catch (err) {
      console.error("Erreur lors du chargement des chats:", err);
    }
  }, [user._id, userFriends, setChats]);

  useEffect(() => {
    fetchChats();
  }, [user._id, setChats, userFriends, fetchChats]);

  const filteredChats = chats?.filter((c) =>
    c?.friend?.userName?.toLowerCase().includes(input.toLowerCase())
  );

  const filteredGroups = groups?.filter((g) =>
    g?.groupName?.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = (chat) => {
    // Marquer un chat comme vu
    const updatedChats = chats.map((item) => {
      if (item._id === chat._id) {
        return { ...item, isSeen: true };
      }
      return item;
    });

    // Trier les chats après sélection du chat
    updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    dispatch(selectChat(chat));
    setSelectedChat(chat);
    setChats(updatedChats);
  };

  const handleSelectGroup = async (group) => {
    console.log("Group selected" + group._id);

    try {
      // Récupérer les détails du groupe avec les membres
      const response = await axios.get(`/api/users/groups/${group._id}`);
      const groupDetails = response.data;
      console.log(groupDetails);
      const updatedChats = chats.map((item) => {
        if (item._id === group._id) {
          return { ...item, isSeen: true };
        }
        return item;
      });

      // Trier les chats après sélection du groupe
      updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

      dispatch(selectGroup(groupDetails));
      setSelectedChat(groupDetails);  // Stocker les détails du groupe sélectionné
      setChats(updatedChats);
    } catch (err) {
      console.error("Erreur lors de la récupération des détails du groupe :", err);
    }
  };

  // Fonction de rappel appelée après l'ajout d'un nouvel ami
  const handleFriendAdded = async () => {
    console.log("Friend added");
    await fetchUserFriends(); // Rafraîchir la liste des chats
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
      {addMode && <AddUser onFriendAdded={handleFriendAdded} />}
      {filteredChats?.map((chat) => (
        <div
          className={`item ${!chat.isSeen ? 'unread' : ''}`}
          key={chat.chatId || chat.friend._id}
          onClick={() => handleSelect(chat)}
        >
          <div className="chatItemContainer">
            <img
              className="chatAvatar"
              src={
                chat.friend.blocked?.includes(user._id)
                  ? nobody
                  : chat.friend.img || nobody
              }
              alt="friend avatar"
            />
            <div className="chatTextContainer">
              <div className="friendUsername">
                <span>
                  {chat.friend.blocked?.includes(user._id)
                    ? "Utilisateur"
                    : chat.friend.userName}
                </span>
              </div>
              <div className="friendLastMessage">
                <p>{chat.lastMessage}</p> {/* Afficher le dernier message ici */}
              </div>
            </div>
          </div>
          {!chat.isSeen && <div className="unread-indicator"></div>}
        </div>
      ))}
      {filteredGroups?.map((group) => (
        console.log(group),
        <div
          className="item"
          key={group._id}
          onClick={() => handleSelectGroup(group)}
        >
          <div className="chatItemContainer">
            <img
              className="chatAvatar"
              src={group.img || groupIcon}
              alt="group avatar"
            />
            <div className="chatTextContainer">
              <div className="friendUsername">
                <span>{group.groupName}</span>
              </div>
              <div className="friendLastMessage">
                <p>{group.lastMessage}</p> {/* Afficher le dernier message ici */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ChatList.propTypes = {
  userFriends: PropTypes.array.isRequired,
  fetchUserFriends: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
};

export default ChatList;
