import './ChatList.css';
import defaultProfile from './defaultProfile.png';
import { useState, useEffect } from 'react';
//import getFullname from './ChatPage.js';
import axios from 'axios';


function Contact({username, messages, handleChatClick, getFullname}){
    const length = messages.length;
    const lastMessageType = messages[length-1].msgType;
    const lastMessage = messages[length-1].content;
    const lastMessageTime = messages[length-1].createdAt;
    const [activeChat, setActiveChat] = useState(null);
    const [friendName, setFriendName] = useState("");

    useEffect(() => {
        const fetchFullname = async () => {
            try{
                const fullName = await getFullname(username);
                setFriendName(fullName);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchFullname();
    }, []); // pass empty array to run effect only once

    return(
        <div
        className={`chat-box ${activeChat === username ? 'active' : ''}`}
        onClick={() => {
            setActiveChat(username);
            handleChatClick(username);}}
        >
    <img src={defaultProfile} alt="Profile" className="friend-pic" />
    <div className="friend-details">
        <div className="friend-header">
            <span className="friend-username">{friendName}</span>
            <span className="last-message-time">{lastMessageTime}</span>
        </div>
        {lastMessageType==="text"&&
            <span className="last-message">{lastMessage}</span>
        }
        {!lastMessageType==="text"&&
            <span className="last-message">{lastMessageType}</span>
        }
    </div>
    </div>
    );
};

export default Contact;