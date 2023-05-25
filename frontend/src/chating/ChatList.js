import defaultProfile from './defaultProfile.png';
import Contact from './Contact.js';
import './ChatList.css';
import { useState } from 'react';
const friends = [
    {
      _id: '1',
      username: 'inbal22',
      lastMessage: 'Hey, how are you doing?',
      lastMessageTime: '10:30 AM',
    },
    {
      _id: '2',
      username: 'john_doe',
      lastMessage: 'Can you send me that file?',
      lastMessageTime: 'Yesterday',
    },
    {
      _id: '3',
      username: 'friend3',
      lastMessage: 'I need your help with something',
      lastMessageTime: '2 days ago',
    },
    {
        _id: '4',
        username: 'friend3',
        lastMessage: 'I need your help with something',
        lastMessageTime: '2 days ago',
    },
    {
        _id: '5',
        username: 'friend3',
        lastMessage: 'I need your help with something',
        lastMessageTime: '2 days ago',
    },
    {
        _id: '6',
        username: 'friend3',
        lastMessage: 'I need your help with something',
        lastMessageTime: '2 days ago',
    },
    {
        _id: '7',
        username: 'friend3',
        lastMessage: 'I need your help with something',
        lastMessageTime: '2 days ago',
    },
    {
        _id: '8',
        username: 'friend3',
        lastMessage: 'I need your help with something',
        lastMessageTime: '2 days ago',
    },
    {
        _id: '9',
        username: 'friend3',
        lastMessage: 'I need your help with somethinggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
        lastMessageTime: '2 days ago',
    },
    {
        _id: '10',
        username: 'friend3',
        lastMessage: 'I need your help with something',
        lastMessageTime: '2 days ago',
    },
    {
        _id: '11',
        username: 'friend3',
        lastMessage: 'I need your help with something',
        lastMessageTime: '2 days ago',
    },
];



function ContactList({ friendsList, activeContact, handleChatClick, getFullname }) {
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
        />
      );
    });
  
    return <div>{contactsList}</div>;
  }



function ChatList({ username, myFullname, friendsList, setFriendUsername, setFriendName, chooseFriend, getFullname, setFriendProduct}) {
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
                <img src={defaultProfile} alt="Profile" className="profile-pic" />
                <span className="username">{myFullname}</span>
            </div>
            <div className="chats-container">
                <ContactList
                friendsList={friendsList}
                activeContact={activeContact}
                handleChatClick={handleChatClick}
                getFullname={getFullname}
                />
            </div>
        </div>
    );
}




export default ChatList;