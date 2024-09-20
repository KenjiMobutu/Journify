import "./friendChat.css";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { format } from "timeago.js";
import EmojiPicker from 'emoji-picker-react';
import phone from '../../assets/phone.png';
import video from '../../assets/video.png';
import info from '../../assets/info.png';
import camera from '../../assets/camera.png';
import mic from '../../assets/mic.png';
import emojiIcon from '../../assets/emoji.png';
import ChatContext from "../../context/ChatContext";

import axios from "axios";
import avatar from '../../assets/nobody.png';

const FriendChat = ({ socket }) => {
  const { user } = useContext(AuthenticationContext);

  const [friend, setFriend] = useState(null);
  const [chat, setChat] = useState({ messages: [] });
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isCurrentUserBlocked, setIsCurrentUserBlocked] = useState(false);
  const [isReceiverBlocked, setIsReceiverBlocked] = useState(false);
  const { selectedChat, setChats, chats, updateLastMessage, lastMessage, setLastMessage} = useContext(ChatContext);
  const friendId = selectedChat?.friend._id;
  const chatId = selectedChat?._id;

  const endRef = useRef(null);

  console.log(friendId);
  console.log(chat);
  console.log(selectedChat);
  console.log(messages);
  console.log(lastMessage);
  // Socket.io event listeners
  useEffect(() => {
    if (chatId) {
      // Connexion à la salle de chat avec le chatId réel
      socket?.emit('joinChat', { chatId, userId: user._id });

      socket?.on('userJoined', (data) => {
        console.log(data.message);
      });

      socket?.on('receiveMessage', (newMessage) => {
        setChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        }));
      });

      return () => {
        socket?.off('receiveMessage');
      };
    }
  }, [user._id, chatId, socket]);

  // Fetch friend's data
  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const response = await axios.get(`/api/users/${friendId}`);
        setFriend(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'ami :', error);
      }
    };

    if (friendId) {
      fetchFriendData();
    }
  }, [friendId]);

  // Fetch chat and messages
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await axios.get(`api/users/findUserChat/${user._id}/${friendId}`);
        setChat(response.data);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Erreur lors de la récupération du chat :', error);
      }
    };

    if (chatId) {
      fetchChat();
    }
  }, [chatId, friendId, user._id]);

  useEffect(() => {
    if (messages && friendId) {
      const lastMessage = messages[messages.length - 1];
      console.log('lastMessage:', lastMessage);
      //setLastMessage(lastMessage);
    }
  }, [messages, friendId, setLastMessage]);

  // Check if users are blocked
  useEffect(() => {
    if (friend) {
      setIsCurrentUserBlocked(friend.blockedUsers?.includes(user._id));
      setIsReceiverBlocked(user.blockedUsers?.includes(friend._id));
    }
  }, [user, friend]);

  const handleSend = async () => {
    if (text.trim() === "") return;

    let imgUrl = null;

    try {
      if (img) {
        imgUrl = img.url;
      }

      // Créer les données du message
      const messageData = {
        chatId,
        senderId: user._id,
        receiverId: friendId,
        content: text.trim(),
        img: imgUrl,
      };

      // Sauvegarder le message dans la base de données via l'API
      const msg = await axios.post(`/api/users/messages`, messageData);
      const savedMessage = msg.data;
      console.log("Message envoyé :", savedMessage);

      // Envoyer le message via Socket.io pour que l'ami le reçoive en temps réel
      socket?.emit("sendMessage", savedMessage);
      updateLastMessage(chatId, savedMessage.content);

      // Mettre à jour localement les messages dans le chat
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.lastMessage, savedMessage],
        lastMessage: savedMessage.content,
        lastMessageTime: new Date(),
      };

      // Mettre à jour la liste des chats avec le nouveau message
      const updatedChats = chats.map((chat) =>
        chat._id === chatId ? updatedChat : chat
      );

      // Trier les chats par l'heure du dernier message
      updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

      // Appliquer les changements
      setChats(updatedChats);

      // Mettre à jour le chat localement
      setChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, savedMessage],
      }));

      // Réinitialiser les champs
      setImg(null);
      setText("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg({ url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmoji = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, img]);

  return (
    <div className="friendChat">
      <div className="friendChatTop">
        <div className="user">
          <img src={friend?.img || avatar } alt="Friend avatar" />
          <div className="textsTop">
            <span>{friend?.userName}</span>
            <p>En ligne</p> {/* Modifier selon le statut */}
          </div>
        </div>
        <div className="icons">
          <img src={phone} alt="Appel vocal" />
          <img src={video} alt="Appel vidéo" />
          <img src={info} alt="Infos" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message, index) => (
          <div
            className={message.senderId === user._id ? "message own" : "message"}
            key={index}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="Pièce jointe" />}
              <p>{message.content}</p>
            </div>
            <div className="createdAt">
              <span>{format(message.createdAt)}</span>
            </div>
          </div>
        ))}
        {img?.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="Pièce jointe" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src={camera} alt="Ajouter une image" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src={mic} alt="Microphone" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "Vous ne pouvez pas envoyer de message"
              : "Tapez un message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src={emojiIcon}
            alt="Emoji"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default FriendChat;
