import defaultProfile from './defaultProfile.png';
import Contact from './Contact.js';
import './ChatList.css';
import { useState } from 'react';


function ContactList({ friendsList, activeContact, handleChatClick, getFullname, getProfile }) {
    if (friendsList.length === 0) {
      return null;
    }
  
    const contactsList = friendsList.map((friend, key) => {
      return (
        <Contact
          {...friend}
          activeContact={activeContact}
          handleChatClick={handleChatClick}
          key={key}
          getFullname={getFullname}
          getProfile={getProfile}
        />
      );
    });
  
    return <div>{contactsList}</div>;
  }



function ChatList({ username, myFullname, myProfile, friendsList, setFriendUsername, setFriendName, chooseFriend, getFullname, setFriendProduct, getProfile}) {
    const [activeContact, setActiveContact] = useState(null);

    const handleChatClick = (friendUsername) => {
        setActiveContact(friendUsername);
        setFriendUsername(friendUsername);
        chooseFriend(friendUsername);
        setFriendProduct(false);
    };

    return (
        <div className="chat-list-container">
            <div className="profile-container">
                {myProfile !== "" && <img src={`https://drive.google.com/uc?export=view&id=${myProfile}`} alt="Profile" className="profile-pic" />}
                {myProfile == "" && <img src={defaultProfile} alt="Profile" className="profile-pic" />}
                <span className="username">{myFullname}</span>
            </div>
            <div className="chats-container">
                <ContactList
                friendsList={friendsList}
                activeContact={activeContact}
                handleChatClick={handleChatClick}
                getFullname={getFullname}
                getProfile={getProfile}
                />
            </div>
        </div>
    );
}




export default ChatList;