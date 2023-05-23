import './ChatList.css';
import defaultProfile from './defaultProfile.png';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Contact({ username, messages, activeContact, handleChatClick, getFullname }) {
  const length = messages.length;
  console.log(messages);
  const lastMessageType = messages[length - 1].msgType;
  const lastMessage = messages[length - 1].content;
  const lastMessageTime = messages[length - 1].createdAt;
  const lastRealTime = messages[length-1].realTime;
  const [friendName, setFriendName] = useState("");

  useEffect(() => {
    const fetchFullname = async () => {
      try {
        const fullName = await getFullname(username);
        setFriendName(fullName);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFullname();

    console.log("lastMessageType is: " + lastMessageType);
  }, []); // pass empty array to run effect only once

  return (
    <div
      className={`chat-box ${activeContact === username ? 'active' : ''}`}
      onClick={() => handleChatClick(username)}
    >
      <img src={defaultProfile} alt="Profile" className="friend-pic" />
      <div className="friend-details">
        <div className="friend-header">
          <span className="friend-username">{friendName}</span>
          <span className="last-message-time">{lastMessageTime}</span>
        </div>
        {lastMessageType === "text" && (
          <span className="last-message">{lastMessage}</span>
        )}
        {lastMessageType === "image" && (
            <div className="image-message">
            <i className="bi bi-camera"></i>
            <span className="last-message">{lastMessageType}</span>
          </div>
        )}
        {lastMessageType === "video" && (
            <div className="image-message">
            <i className="bi bi-camera-video"></i>
            <span className="last-message">{lastMessageType}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;