import './ChatList.css';
import defaultProfile from './defaultProfile.png';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Contact({ username, messages, activeContact, handleChatClick, getFullname, getProfile }) {
  const length = messages.length;
  const lastMessageType = messages[length - 1].msgType;
  const lastMessage = messages[length - 1].content;
  const lastMessageTime = messages[length - 1].createdAt;
  const lastRealTime = messages[length - 1].realTime;
  const [friendName, setFriendName] = useState("");
  const [friendProfile, setFriendProfile] = useState("");
  const [timeToWrite, setTimeToWrite] = useState("");
    
  useEffect(()=>{
    // Get the current date
    const currentDate = new Date();

    // Subtract one day from the current date
    const targetDate = new Date(currentDate);
    targetDate.setDate(currentDate.getDate() - 1);

    // Convert 'lastRealTime' to a date object if it's not already
    const lastRealTimeDate = new Date(lastRealTime);

    // Compare 'lastRealTime' with the target date
    if (lastRealTimeDate < targetDate) {
      // 'lastRealTime' is yesterday
      setTimeToWrite("Yesterday");
      targetDate.setDate(currentDate.getDate() - 2);
      if (lastRealTimeDate < targetDate) {
        console.log("lastRealTime is two days ago or more");

        // Get the day and month from the date
        const day = lastRealTimeDate.getDate();
        const month = lastRealTimeDate.getMonth() + 1; // Adding 1 because months are zero-based

        // Format the day and month as "dd/mm"
        const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;

        console.log(formattedDate); // Output: "13/05"
        setTimeToWrite(formattedDate);
      }
    } else {
      // 'lastRealTime' is today or later
      setTimeToWrite(lastMessageTime);
    }
  },[messages]);
  

  useEffect(() => {
    const fetchFullname = async () => {
      try {
        const fullName = await getFullname(username);
        setFriendName(fullName);
        const profile = await getProfile(username);
        setFriendProfile(profile);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFullname();
  }, [username]); // pass empty array to run effect only once

  return (
    <div
      className={`chat-box ${activeContact === username ? 'active' : ''}`}
      onClick={() => handleChatClick(username)}
    >
      {friendProfile !== "" && <img src={`https://drive.google.com/uc?export=view&id=${friendProfile}`} alt="Profile" className="friend-pic" />}
      {friendProfile === "" && <img src={defaultProfile} alt="Profile" className="friend-pic" />}
      <div className="friend-details">
        <div className="friend-header">
          <span className="friend-username">{friendName}</span>
          <span className="last-message-time">{timeToWrite}</span>
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
