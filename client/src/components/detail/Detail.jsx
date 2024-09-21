import React from 'react'
import './detail.css'
import {  useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import arrowUp from '../../assets/arrowUp.png';
import arrowDown from '../../assets/arrowDown.png';
import download from '../../assets/download.png';
import axios from 'axios';

const Detail = () => {

  const { user, dispatch} = useContext(AuthenticationContext);
  const isCurrentUserBlocked = null;
  const isReceiverBlocked = null;
  const handleBlock = () => { }
  console.log(user.status);

  const handleStatusChange = (newStatus) => {
    dispatch({
      type: "UPDATE_STATUS",
      payload: newStatus, // Envoyer le nouveau statut
    });
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.img || "./avatar.png"} alt="" />
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
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src={arrowUp} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src={arrowUp} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src={arrowUp} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src={arrowDown} alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src={download} alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src={download} alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src={download} alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src={download} alt="" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src={arrowUp} alt="" />
          </div>
        </div>
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
