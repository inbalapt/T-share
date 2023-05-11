
/*
import ChatingWith from './ChatingWith';
import './ChatPage.css';
/*
import axios from 'axios';


//import React, { useRef } from "react";
var friendsFlag =0;
*/

import { useLocation } from "react-router-dom";
import { useEffect, useState , useRef} from 'react';
import axios from 'axios';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';




// List of friends names 
const getFriendsList = async (username) => {
    try {
      const response = await axios.get(`http://localhost:3000/getFriends?username=${username}`);
      return response.data.friends;
    } catch (error) {
      console.error(error);
    }
};

// Get name of the user
const getFullname = async (username) => {
  try {
    const response = await axios.get(`http://localhost:3000/getFullname?username=${username}`);
    return response.data.fullName;
  } catch (error) {
    console.error(error);
  }
};



function ChatPage() {
    const location = useLocation();
    const username = location.state.username;
    //const [activeChat, setActiveChat] = useState(null);
    //const [msgs, setMsgs] = useState([]);
    //const theFriendTop = useRef(''); 
    const [friendUsername, setFriendUsername] = useState('');
    const [friendsList, setFriendsList] = useState([]);
    const [currentMsgs, setCurrentMsgs] = useState([]); 
    const [myName, setMyName] = useState("");

    useEffect(() => {
        const fetchFriendsList = async () => {
          const friends = await getFriendsList(username);
          setFriendsList(friends);
        };
        
        const fetchFullname = async () => {
          const fullName = await getFullname(username);
          setMyName(fullName);
        }
        fetchFriendsList();
        fetchFullname();
    }, []); // pass empty array to run effect only once

    useEffect(() => {
      console.log(friendsList);
    }, [friendsList]);
   

    async function chooseFriend(friendUsername){
        try {
            const url = `http://localhost:3000/getMessages?username=${username}&friendUsername=${friendUsername}`;
            const response = await axios.get(url);
            setCurrentMsgs(response.data.messages);
            return response.data.messages;
          } catch (error) {
            console.error(error);
          }
    }
   

  return(
      <div className="chat-container">
          {friendUsername && <ChatMessages username={username} friendUsername={friendUsername} currentMsgs={currentMsgs} setCurrentMsgs={setCurrentMsgs} getFullname={getFullname}/>}
          <ChatList username={username} myFullname={myName} friendsList={friendsList} setFriendUsername={setFriendUsername} chooseFriend={chooseFriend} getFullname={getFullname}/>
      </div>
  );

}


export default ChatPage;

