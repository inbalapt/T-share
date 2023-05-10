import defaultProfile from './defaultProfile.png';
import './ChatMessages.css'
import Message from './Message.js';
import axios from 'axios';
import { useState, useEffect } from 'react';

import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;



function ContactMessages({currentMsgs}){
    if (currentMsgs == []) {
        return (<></>);
    }
    console.log(currentMsgs);
    const messagesList = currentMsgs.map((message, key) => {
        return <Message {...message} key={key}/>
    });
    return (
        <div>   
            {messagesList}
        </div>
    );
}


function ChatMessages({username ,friendUsername, currentMsgs, setCurrentMsgs, getFullname}){

    const [friendName,setFriendName] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", username);
      socket.on("connection", ()=>{
        setSocketConnected(true);
      })
      socket.on('message recieved', (newMessage)=>{
        console.log(currentMsgs);
        if(!selectedChatCompare || selectedChatCompare != friendUsername){
            console.log("blabla");
        }else{
            //setCurrentMsgs((prevMsgs) => [...prevMsgs, newMessage]);
            
        }
        })
    }, []);
     
   /* useEffect(()=>{
        socket.on('message recieved', (newMessage)=>{
            console.log(newMessage);
            if(!selectedChatCompare || selectedChatCompare != friendUsername){
                console.log("blabla");
            }else{
                
                setCurrentMsgs([...currentMsgs], newMessage);
            }
        })

    });*/


    useEffect(() => {
        const fetchFullname = async () => {
            try{
                const fullName = await getFullname(friendUsername);
                console.log(fullName);
                setFriendName(fullName);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchFullname();


        selectedChatCompare = friendUsername;
    }, [friendUsername]); // pass empty array to run effect only once


    /* Sending message into the server */
    async function handleSend() {
        // The text that we send
        var textMessage = document.getElementById("textMsg").value;
        textMessage = textMessage.trim();
        if(textMessage==""){
            document.getElementById("textMsg").value = "";
            return;
        }
        // Adding the text message to the two converasions
        function addZero(variable){
            if(variable < 10){
                return (variable = "0" + variable);
            }
            return(variable);
        }
        // Update time
        var today = new Date();
        var hour=addZero(today.getHours())
        var minute=addZero(today.getMinutes())
        var time = hour + ":" + minute;
        // Add to server
        var myNewMessage = {sender: true, msgType:"text", content: textMessage, createdAt: time};
        var otherNewMessage = {sender: false, msgType:"text", content: textMessage, createdAt: time};
        sendText(myNewMessage, username, friendUsername)
        .then(sendText(otherNewMessage, friendUsername, username))
        .then(document.getElementById("textMsg").value = "");
        
        socket.emit('new message', myNewMessage, username);
        socket.emit('new message', otherNewMessage, friendUsername);
        
    }

    

    // Update database of the sender with the new message
    async function sendText(newMessage, sender, receiver){
        try {
            const encodedMessage = encodeURIComponent(JSON.stringify(newMessage));
            const response = await axios.post(`http://localhost:3000/messages?message=${encodedMessage}&username=${sender}&friendUsername=${receiver}`);
            console.log(response.data);
           
        }
        catch (error) {
            console.log(error);
        }
        
    };


    return(
        <div class="chat-messages">
            <div class="chat-header">
                <img src={defaultProfile} alt="Profile" className="profile-image" />
                <div class="friend-info">
                <div class="friend-name">{friendName}</div>
                <div class="friend-status">Online</div>
                </div>
            </div>
            <div class="chat-body">
                <ContactMessages currentMsgs={currentMsgs} />
            </div>
            <div class="chat-footer">
                <input class="message-input" id="textMsg" placeholder="Enter text here..." value={newMessage}></input>
                <button class="send-button" onClick={handleSend}>Send</button>
            </div>
        </div>

    );
};

export default ChatMessages;