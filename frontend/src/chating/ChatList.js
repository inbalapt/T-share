import defaultProfile from './defaultProfile.png';
import Contact from './Contact.js';
import './ChatList.css';

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


function ContactList({friendsList,handleChatClick, getFullname}){
    if (friendsList == []) {
        return (<></>);
    }
    const contactsList = friendsList.map((friend, key) => {
        return <Contact {...friend} handleChatClick={handleChatClick} key={key} getFullname={getFullname} />
    });
    return (
        <div>   
            {contactsList}
        </div>
    );
}



/*
under chat-container
{friends.map((friend) => (
            <div
            key={friend._id}
            className={`chat-box ${activeChat === friend._id ? 'active' : ''}`}
            onClick={() => {
                setActiveChat(friend._id);
                handleChatClick(friend.username);}}
            >
            <img src={defaultProfile} alt="Profile" className="friend-pic" />
            <div className="friend-details">
                <div className="friend-header">
                    <span className="friend-username">{friend.username}</span>
                    <span className="last-message-time">{friend.lastMessageTime}</span>
                </div>
                <span className="last-message">{friend.lastMessage}</span>
            </div>
            </div>
        ))}
        */
function ChatList({username, myFullname, friendsList, setFriendUsername, setFriendName, chooseFriend, getFullname}){
    
   
    const handleChatClick = (friendUsername) => {
        setFriendUsername(friendUsername);
        chooseFriend(friendUsername);
    };

  return (
    <div className="chat-list-container">
        <div className="profile-container">
            <img src={defaultProfile} alt="Profile" className="profile-pic" />
            <span className="username">{myFullname}</span>
        </div>
        <div className="chats-container">
            <ContactList friendsList={friendsList} handleChatClick={handleChatClick} getFullname={getFullname}/>
        </div>
    </div>
    );
    
}





export default ChatList;