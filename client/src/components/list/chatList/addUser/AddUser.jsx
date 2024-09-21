import "./addUser.css";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../../../../context/AuthenticationContext";
import axios from "axios";

const AddUser = ({ onFriendAdded }) => {
  const [searchInput, setSearchInput] = useState(""); // Pour stocker l'input de recherche
  const [findUser, setFindUser] = useState(null); // Pour stocker l'utilisateur trouvé
  const [error, setError] = useState(null); // Pour gérer les erreurs
  const { user } = useContext(AuthenticationContext);

  // Fonction pour gérer la recherche de l'utilisateur
  const handleSearch = async (e) => {
    e.preventDefault();

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
      //alert(`${findUser.userName} has been added as your friend!`);

      // Réinitialiser après ajout
      setFindUser(null);
      setSearchInput("");
      onFriendAdded();
    } catch (err) {
      console.error(err);
      setError("An error occurred while adding the user.");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Username"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {/* Affiche un message d'erreur si besoin */}
      {error && <p className="errorMessage">{error}</p>}

      {/* Affiche les informations de l'utilisateur trouvé */}
      {findUser && (
        <div className="user">
          <div className="detail">
            <img src={findUser.img || "../src/assets/avatar.png"} alt="" />
            <span>{findUser.userName}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
