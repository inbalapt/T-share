
/*
import ChatingWith from './ChatingWith';
import './ChatPage.css';
/*
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';

//import React, { useRef } from "react";
var friendsFlag =0;
*/

import { useLocation } from "react-router-dom";
import { useEffect, useState , useRef} from 'react';
import axios from 'axios';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import * as signalR from '@microsoft/signalr';



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
    const [friendUsername, setFriendUsername] = useState('');
    const [friendsList, setFriendsList] = useState([]);
    const [currentMsgs, setCurrentMsgs] = useState([]); 
    const [myName, setMyName] = useState("");

   

   // SignalR- real-time messaging 
  /*useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/chatHub') // The URL should match the backend SignalR hub URL
      .build();

    connection.start().catch((err) => console.error(err));

    connection.on('broadcastMessage', (message) => {
      // Handle the received message, e.g., update the messages state
      setCurrentMsgs((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the connection when the component unmounts
    return () => {
      connection.stop();
    };
  }, []);*/


    useEffect(() => {
        const fetchFriendsList = async () => {
          const friends = await getFriendsList(username);
          setFriendsList(friends);
        };
        
        const fetchFullname = async () => {
          const fullName = await getFullname(username);
          console.log(fullName);
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
            console.log(currentMsgs);
            return response.data.messages;
          } catch (error) {
            console.error(error);
          }
    }
   

  return(
      <div className="chat-container">
          <ChatMessages username={username} friendUsername={friendUsername} currentMsgs={currentMsgs} getFullname={getFullname}/>
          <ChatList username={username} myFullname={myName} friendsList={friendsList} setFriendUsername={setFriendUsername} chooseFriend={chooseFriend} getFullname={getFullname}/>
      </div>
  );

}


export default ChatPage;

