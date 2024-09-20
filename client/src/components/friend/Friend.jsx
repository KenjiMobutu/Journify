import "./friend.css"
import { useContext } from "react";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { ChatProvider } from '../../context/ChatContext';
import List from "../../components/list/List";
import Chat from "../../components/friendChat/FriendChat.jsx";
import Detail from "../../components/detail/Detail";
import Notification from "../../components/notification/Notification";
import { useEffect, useState } from "react";
import avatar from '../../assets/nobody.png';
import axios from "axios";

const Friend = ({ socket }) => {
  const { user } = useContext(AuthenticationContext);
  const chatId = null;
  const [userFriends, setUserFriends] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // Pour stocker l'input de recherche
  const [findUser, setFindUser] = useState(null); // Pour stocker l'utilisateur trouvé
  const [error, setError] = useState(null); // Pour gérer les erreurs

  // Fonction pour récupérer la liste des amis
  const fetchUserFriends = async () => {
    try {
      const response = await fetch(`/api/users/userFriends/${user._id}`);
      const data = await response.json();
      setUserFriends(data);
    } catch (err) {
      console.error("Erreur lors du chargement des amis:", err);
    }
  };
  
  // Fonction pour gérer la recherche de l'utilisateur
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null); // Réinitialiser les erreurs

    try {
      // Requête pour rechercher un utilisateur par nom d'utilisateur
      const res = await axios.get(`/api/users/search/${searchInput}`);
      console.log(res.data);
      if (res.data) {
        setFindUser(res.data);
        setError(null); // Reset erreur en cas de succès
      } else {
        setFindUser(null);
        setError("User not found.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while searching for the user.");
    }
  };

  // Fonction pour gérer l'ajout de l'utilisateur comme ami
  const handleAdd = async () => {
    console.log(findUser);
    try {
      // Requête pour ajouter l'utilisateur trouvé en tant qu'ami
      await axios.post(`/api/users/friends/add`, {
        user: user._id,
        friend: findUser._id,
      });
      alert(`${findUser.userName} has been added as your friend!`);

      // Réinitialiser après ajout
      setFindUser(null);
      setSearchInput("");
      fetchUserFriends();
    } catch (err) {
      console.error(err);
      setError("An error occurred while adding the user.");
    }
  };

  const handleCloseFindUser = () => {
    setFindUser(null);
  };

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(`/api/users/userFriends/${user._id}`);
        const data = await response.json();
        console.log(data);
        setUserFriends(data);
      } catch (err) {
        console.error("Erreur lors du chargement des amis:", err);
      }
    };
    if (user) {
      fetchUserFriends();
    }

  }, [user._id, user]);

  return (
    <>
      <div className="friend-group-container">
        <div className="friend-management">
          <h2>Ajouter un ami</h2>
          <form id="add-friend-form">
            <input
              type="email"
              id="friend-email"
              className="input-field"
              placeholder="Username de l'ami"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              required
            />
            <button type="submit" className="btn-add" onClick={handleSearch}>Ajouter</button>
          </form>
          {/* Affiche un message d'erreur si besoin */}
          {error && <p className="errorMessage">{error}</p>}
          <div className="friend-list">
            <h3>Mes amis</h3>
            {/* Affiche les informations de l'utilisateur trouvé */}
            {findUser && (
              <div className="findUser">
                <div className="foundUserTitle">
                  <span>USER FOUND</span>
                  <button onClick={handleCloseFindUser} className="foundUserTitleClose">X</button>
                </div>
                <div className="foundUser">
                  <div className="foundUserDetail">
                    <img src={findUser.img || "../src/assets/nobody.png"} alt="" className="friendImg" />
                    <span>{findUser.userName}</span>
                  </div>
                  <button onClick={handleAdd} className="foundUserBtn">Add User</button>
                </div>
              </div>
            )}
            <ul id="friend-list">
              {userFriends.map((friend) => (
                <li key={friend.friend._id}>
                  <img src={friend.friend.img || avatar} alt="" className="friendImg" />
                  <span>{friend.friend.userName}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="group-management">
          <h2>Créer un groupe</h2>
          <form id="create-group-form">
            <input
              type="text"
              id="group-name"
              className="input-field"
              placeholder="Nom du groupe"
              required
            />
            <input
              type="text"
              id="group-members"
              className="input-field"
              placeholder="Emails des membres (séparés par des virgules)"
            />
            <button type="submit" className="btn-create">Créer le groupe</button>
          </form>
          <div className="group-list">
            <h3>Mes groupes</h3>
            <ul id="group-list">
              {/* <!-- Liste des groupes sera rendue ici --> */}
            </ul>
          </div>
        </div>
      </div>
      <div className="chat-container">
        {user ? (
          <>
            <ChatProvider>
              <List />
              <Chat socket={socket} />
              <Detail />
            </ChatProvider>
          </>
        ) : (
          "Please login to chat"
        )}
        <Notification />
      </div>
    </>
  )
}

export default Friend
