import React from 'react'
import './detail.css'
import {  useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import arrowUp from '../../assets/arrowUp.png';
import arrowDown from '../../assets/arrowDown.png';
import download from '../../assets/download.png';
import axios from 'axios';
import nobody from '../../assets/nobody.png';

const Detail = ({socket}) => {

  const { user, dispatch} = useContext(AuthenticationContext);
  const isCurrentUserBlocked = null;
  const isReceiverBlocked = null;
  const handleBlock = () => { }
  console.log(user.status);

  const handleStatusChange = (newStatus) => {
    // Mise à jour du statut dans le contexte
  dispatch({
    type: "UPDATE_STATUS",
    payload: newStatus, // Envoyer le nouveau statut
  });

  // Mettre à jour le statut dans localStorage immédiatement
  const updatedUser = { ...user, status: newStatus };
  console.log("UPDATED USER:",updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
  socket.emit("statusChange", { userId: user._id, status:newStatus});
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.img || nobody} alt="" />
        <h2>{user?.userName}</h2>
        <span className={`status-icon ${user?.status}`}></span>
        <select
          className="status-selector"
          value={user?.status || "online"}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="online">En ligne</option>
          <option value="offline">Hors ligne</option>
          <option value="do_not_disturb">Ne pas déranger</option>
          <option value="away">Absent</option>
        </select>
      </div>
      <div className="info">
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
              ? "User blocked"
              : "Block User"}
        </button>
      </div>
    </div>
  )
}

export default Detail
