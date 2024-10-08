import "./friend.css"
import { useContext } from "react";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import Chat from "../../components/friendChat/FriendChat.jsx";
import Detail from "../../components/detail/Detail";
import Notification from "../../components/notification/Notification";
import { useEffect, useState } from "react";
import avatar from '../../assets/nobody.png';
import axios from "axios";
import ChatContext from "../../context/ChatContext.jsx";
import { useCallback } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import ListChat from "../../components/list/List";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const Friend = ({ socket }) => {
  const { user } = useContext(AuthenticationContext);
  const { setSelectedChat } = useContext(ChatContext);
  const [userFriends, setUserFriends] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // Pour stocker l'input de recherche
  const [findUser, setFindUser] = useState(null); // Pour stocker l'utilisateur trouvé
  const [error, setError] = useState(null); // Pour gérer les erreurs
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupError, setGroupError] = useState("");

  console.log(groups);
  console.log(userFriends);

  // Récupérer les groupes de l'utilisateur
  const fetchUserGroups = useCallback(async () => {
    try {
      // Requête pour récupérer les groupes utilisateur
      const response = await axios.get(`/api/users/userGroups/${user._id}`);
      console.log(response.data);
      setGroups(response.data); // Mettre à jour l'état avec les groupes récupérés
    } catch (err) {
      console.error("Erreur lors de la récupération des groupes", err);
    }
  }, [user]);

  useEffect(() => {
    fetchUserGroups();
  }, [fetchUserGroups]);

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

  // Fonction pour gérer la suppression d'un ami
  const handleDeleteFriend = async (friendId) => {
    try {
      // Requête pour supprimer l'ami
      await axios.delete(`/api/users/friends/delete/${user._id}/${friendId}`);
      // supprimer le chat
      await axios.delete(`/api/users/deleteUserChat/${user._id}/${friendId}`);

      // Récupérer les groupes où l'ami est membre
      const groupsWithFriend = groups.filter((group) =>
        group.members.some((member) => member._id === friendId)
      );

      // Pour chaque groupe, supprimer l'ami
      await Promise.all(
        groupsWithFriend.map(async (group) => {
          await axios.delete(`/api/users/groups/delete/${group._id}/${user._id}`, {
            data: { groupId: group._id, userId: friendId },
          });
        })
      );

      // Mettre à jour la liste des groupes localement
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          groupsWithFriend.includes(group)
            ? {
              ...group,
              members: group.members.filter((member) => member._id !== friendId),
            }
            : group
        )
      );

      // Après suppression, mettre à jour la liste d'amis
      fetchUserFriends();
      setSelectedChat(null);
      fetchUserGroups();
    } catch (err) {
      console.error(err);
    }
  };

  // Fonction pour créer un groupe avec les amis sélectionnés
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (groupMembers.length === 0) {
      setGroupError("Vous devez sélectionner au moins un ami pour créer un groupe.");
      return;
    }

    try {
      // Requête pour créer un groupe avec le nom et les amis sélectionnés
      await axios.post(`/api/users/groups/create`, {
        groupName,
        members: groupMembers, // Ajouter les membres du groupe
        creatorId: user._id,
      });
      alert(`Group "${groupName}" has been created!`);
      setGroupName("");
      setGroupMembers([]);
      setGroupError("");
      fetchUserGroups(); // Rafraîchir la liste des groupes
    } catch (err) {
      console.error("An error occurred while creating the group:", err);
    }
  };

  // Fonction pour supprimer un groupe
  const handleDeleteGroup = async (groupId) => {
    try {
      // Requête pour supprimer le groupe
      await axios.delete(`/api/users/groups/delete/${groupId}`);
      fetchUserGroups(); // Rafraîchir la liste des groupes
    } catch (err) {
      console.error("An error occurred while deleting the group:", err);
    }
  };

  // Fonction pour ajouter un ami à la liste des membres du groupe
  const handleAddMember = (friendId) => {
    setGroupMembers((prevMembers) => {
      if (prevMembers.includes(friendId)) {
        // Si l'ID est déjà présent, on le retire
        return prevMembers.filter((id) => id !== friendId);
      } else {
        // Sinon, on l'ajoute
        return [...prevMembers, friendId];
      }
    });
  };

  const handleDeleteMember = async (groupId, memberId) => {
    const confirmDelete = window.confirm('Voulez-vous vraiment supprimer ce membre du groupe ?');
    if (!confirmDelete) return;

    try {
      // Envoyer une requête DELETE à votre API pour supprimer le membre
      await axios.delete(`/api/users/groups/delete/${groupId}/${memberId}`);

      // Mettre à jour l'état local pour refléter la suppression
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId
            ? {
              ...group,
              members: group.members.filter((member) => member._id !== memberId),
            }
            : group
        )
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du membre :', error);
      // Vous pouvez afficher un message d'erreur à l'utilisateur ici
    }
  };

  return (
    <>
      <div className="friend-group-container">
        <div className="friend-management">
          <h2>Ajouter un ami</h2>
          <form id="add-friend-form" onSubmit={handleSearch}>
            <input
              type="text"
              id="friend-email"
              className="input-field"
              placeholder="Friend Username"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              required
            />
            <button type="submit" className="btn-add">Rechercher</button>
          </form>
          {error && <p className="errorMessage">{error}</p>}

          <div className="friend-list-section">
            <h3>Mes Amis</h3>
            {findUser && (
              <div className="findUser">
                <div className="foundUserTitle">
                  <span>Utilisateur trouvé</span>
                  <button onClick={handleCloseFindUser} className="foundUserTitleClose">X</button>
                </div>
                <div className="foundUser">
                  <div className="foundUserDetail">
                    <img src={findUser.img || avatar} alt="" className="friendImg" />
                    <span>{findUser.userName}</span>
                  </div>
                  <button onClick={handleAdd} className="foundUserBtn">Ajouter</button>
                </div>
              </div>
            )}

            <ul className="friend-list">
              {userFriends?.map((friend) => (
                <li key={friend?.friend?._id} className="friend-item">
                  <div className="friend-info">
                    <img src={friend?.friend?.img || avatar} alt="" className="friend-avatar" />
                    <span>{friend?.friend?.userName}</span>
                  </div>
                  <button className="btn-delete" onClick={() => handleDeleteFriend(friend?.friend?._id)}>Supprimer</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="group-management">
          <h2>Créer un groupe</h2>
          <form id="create-group-form" onSubmit={handleCreateGroup}>
            <input
              type="text"
              id="group-name"
              className="input-field"
              placeholder="Nom du groupe"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: '#1b1b2f', borderRadius: '10px' }}>
              {userFriends?.map((friend) => {
                const labelId = friend?.friend?.userName;
                return (
                  <ListItem
                    key={friend?.friend?._id}
                    disablePadding
                  >
                    <ListItemButton
                      onClick={() => handleAddMember(friend?.friend?._id)}  // Gère le clic sur l'élément
                      sx={{ cursor: 'pointer' }}  // Change le curseur pour indiquer que l'élément est cliquable
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={friend?.friend?.userName}
                          src={friend?.friend?.img || avatar}
                        />
                      </ListItemAvatar>
                      <ListItemText id={labelId} primary={friend?.friend?.userName} sx={{ color: 'white' }} />
                      <Checkbox
                        edge="end"
                        checked={groupMembers.includes(friend?.friend?._id)}  // Met à jour l'état de la checkbox
                        onChange={() => handleAddMember(friend?.friend?._id)}  // Gère le clic sur la checkbox
                        inputProps={{ 'aria-labelledby': labelId }}
                        onClick={(e) => e.stopPropagation()}  // Empêche la propagation du clic vers le ListItemButton
                        sx={{ color: 'white' }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            {groupError && <p className="errorMessage">{groupError}</p>}
            <button type="submit" className="btn-create">Créer le groupe</button>
          </form>

          <div className="group-list-section">
            <h3>Mes Groupes</h3>
            <ul className="group-list">
              {groups?.map((group) => (
                <li key={group._id} className="group-item">
                  <span className="group-name">{group.groupName}</span>
                  <ul className="group-members">
                    {group.members.map((member) => (
                      <li key={member._id} className="group-member-item">
                        <div className="member-info">
                          <img src={member.img || avatar} alt="" className="group-member-avatar" />
                          <span>{member.userName}</span>
                        </div>
                        <div className="deleteMemberIcon">
                          <DeleteOutlineOutlinedIcon className="delete-icon"
                            onClick={() => handleDeleteMember(group._id, member._id)} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className="btn-delete" onClick={() => handleDeleteGroup(group._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="chat-container">
        {user ? (
          <>
            <ListChat userFriends={userFriends} fetchUserFriends={fetchUserFriends} groups={groups} socket={socket}/>
            <Chat socket={socket} />
            <Detail />
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
