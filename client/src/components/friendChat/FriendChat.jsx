import "./friendChat.css";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { format } from "timeago.js";
import EmojiPicker from 'emoji-picker-react';
import camera from '../../assets/camera.png';
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
  const { selectedChat, setChats, chats, updateLastMessage } = useContext(ChatContext);
  const friendId = selectedChat?.friend?._id;
  const friendIds = selectedChat?.members?.map((member) => member._id);
  const chatId = selectedChat?._id;

  console.log('selectedChat:', selectedChat);

  const endRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      socket?.emit('joinChat', { chatId, userId: user._id });

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

  useEffect(() => {
    const fetchChat = async () => {
      try {
        if (selectedChat.isGroup) {
          const response = await axios.get(`api/users/findGroupChat/${selectedChat._id}`);
          console.log('Group chat response:', response.data);
          setChat(response?.data);
          setMessages(response?.data.messages);
          return;
        }
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
  }, [chatId, friendId, selectedChat?._id, selectedChat?.isGroup, user._id]);

  useEffect(() => {
    if (messages && friendId) {
      const lastMessage = messages[messages.length - 1];
      console.log('lastMessage:', lastMessage);
    }
  }, [messages, friendId]);

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

      const messageData = {
        chatId,
        senderId: user._id,
        receiverId: selectedChat.isGroup
          ? selectedChat.members.map(member => member._id) // Si c'est un groupe, on envoie à tous les membres
          : [friendId], // Si c'est un message privé, on l'envoie à un seul ami
        content: text.trim(),
        img: imgUrl,
      };

      const msg = await axios.post(`/api/users/messages`, messageData);
      const savedMessage = msg.data;
      socket?.emit("sendMessage", savedMessage);

      // Mise à jour du dernier message du chat
      updateLastMessage(chatId, savedMessage.content);

      // Met à jour les messages dans l'état local
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.lastMessage, savedMessage],
        lastMessage: savedMessage.content,
        lastMessageTime: new Date(),
      };

      const updatedChats = chats.map((chat) =>
        chat._id === chatId ? updatedChat : chat
      );

      updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

      setChats(updatedChats);

      setChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, savedMessage],
      }));

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
  }, [chat?.messages, img]);

  useEffect(() => {
    if (selectedChat?.isGroup) {
      // Si c'est un groupe, récupérer les messages du groupe
      const fetchGroupChat = async () => {
        try {
          const response = await axios.post(`/api/users/findGroupChat/${selectedChat._id}`, {
            userId: user._id,
            friendIds: selectedChat.members.map(member => member._id),
          });
          console.log('Group chat response:', response.data);
          setMessages(response.data.messages);
        } catch (error) {
          console.error('Erreur lors de la récupération des messages du groupe :', error);
        }
      };
      fetchGroupChat();
    }
  }, [selectedChat, user._id]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket]);

  return (
    <div className="friendChat">
      {selectedChat ? (
        <>
          <div className="friendChatTop">
            {selectedChat?.isGroup ? (
              <div className="groupInfo">
                <h3>{selectedChat.groupName}</h3>
                <div className="groupMembers">
                  <p><strong>Membres du groupe :</strong></p>
                  {selectedChat?.members?.map((member) => (
                    <div key={member._id} className="groupMember">
                      <img src={member.img || avatar} alt="Member avatar" />
                      <span>{member.userName}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="user">
                <img src={friend?.img || avatar} alt="Friend avatar" />
                <div className="textsTop">
                  <span>{friend?.userName || "Utilisateur"}</span>
                  <p>{friend?.status || "Hors ligne"}</p> {/* Affiche le statut */}
                </div>
              </div>)}
          </div>

          <div className="center">
            {chat?.messages?.length > 0 ? (
              chat?.messages?.map((message, index) => (
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
              ))
            ) : (
              <p className="noMessages">No messages yet</p>
            )}
            {img?.url && (
              <div className="message own">
                <div className="texts">
                  <img src={img.url} alt="Pièce jointe" />
                </div>
              </div>
            )}
            <div ref={endRef}></div>
          </div>
        </>
      ) : (
        <div className="noChat">
          Select a chat to start chatting
        </div>
      )}
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
          disabled={isCurrentUserBlocked || isReceiverBlocked || !selectedChat}
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
          disabled={isCurrentUserBlocked || isReceiverBlocked || !selectedChat}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default FriendChat;
