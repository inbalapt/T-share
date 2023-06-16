import defaultProfile from './defaultProfile.png';
import './ChatMessages.css'
import Message from './Message.js';
import axios from 'axios';
import { useState, useEffect } from 'react';

import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;


// Get id of friend
const getID = async (username) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/getID?username=${username}`);
      return response.data._id;
    } catch (error) {
      console.error(error);
    }
  };

function ContactMessages({currentMsgs, username}){
    if (currentMsgs == []) {
        return (<></>);
    }
   
    const messagesList = currentMsgs.map((message, key) => {
        return <Message username={username} {...message} key={key}/>
    });
    return (
        <div>   
            {messagesList}
        </div>
    );
}

const addNewFriend = async (username, friendUsername, textMessage, msgType, time) => {
  try {
    const response = await axios.post('http://localhost:3000/addNewFriend', {
      username,
      friendUsername,
      content: textMessage,
      type: msgType,
      createdAt: time,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

  

function ChatMessages({username ,friendUsername, currentMsgs, setCurrentMsgs, getFullname, getProfile, automaticMessage, itemPhoto, friends, setChangeList}){

    const [friendName,setFriendName] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [friendID, setFriendID] = useState("");
    const [messageInput, setMessageInput] = useState(automaticMessage);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [friendProfile, setFriendProfile] = useState("");
   
    
    useEffect(() => {
      if (automaticMessage !== '') {
        setMessageInput(automaticMessage);
        console.log(itemPhoto);
      }
      else{
        setMessageInput('');
      }
    }, [automaticMessage]);

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", username);
      socket.on("connection", ()=>{
        setSocketConnected(true);
      })

      socket.emit("join room", friendID);
    }, []);
     
    useEffect(()=>{
        socket.on('message recieved', (message, user, flag)=>{
            console.log("hi");
            
            // not talking to anyone
            if(!selectedChatCompare){
                console.log("bye");
            }
            // i sent a message
            if(user == username && flag == 1){
                setCurrentMsgs([...currentMsgs, message]);
                setChangeList(true);
            }
            // my contant sent a message
            else if(user == username && flag == 2){
                setCurrentMsgs([...currentMsgs, message]);
            }
            else{
                console.log("we have aproblem");
            }
        })
    });


    useEffect(() => {
        const fetchFullname = async () => {
            try{
                const fullName = await getFullname(friendUsername);
                setFriendName(fullName);
                const profile = await getProfile(friendUsername);
                setFriendProfile(profile);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchFullname();
        

        selectedChatCompare = friendUsername;

        const fetchFriendID = async () => {
            const friendID = await getID(friendUsername);
            setFriendID(friendID);
        }
        fetchFriendID();
    }, [friendUsername]); // pass empty array to run effect only once


    // Adding the text message to the two converasions
    function addZero(variable){
        if(variable < 10){
            return (variable = "0" + variable);
        }
        return(variable);
    }
    /* Sending message into the server */
    async function handleSend() {
        // Update time
        var today = new Date();
        var hour=addZero(today.getHours())
        var minute=addZero(today.getMinutes())
        var time = hour + ":" + minute;

        if (selectedImage) {
            const sendImageToServer = async () => {
                try {
                    const formData = new FormData();
                    formData.append("image", selectedImage);
            
                    const response = await axios.post(`http://localhost:3000/uploadImage?myUsername=${username}&friendUsername=${friendUsername}&time=${time}`, formData, {
                        headers: {
                        "Content-Type": "multipart/form-data",
                        },
                    });
            
                    // Handle the response from the server
                    console.log(response.data);
                    var myNewMessage = {sender: true, msgType:"image", content: response.data, createdAt: time};
                    var otherNewMessage = {sender: false, msgType:"image", content: response.data, createdAt: time};
                    setChangeList(true);
                    socket.emit('send message', "", myNewMessage, username, 1);
                    socket.emit('send message', friendID, otherNewMessage, friendUsername, 2);
                // Process the response as needed
                } catch (error) {
                  console.error(error);
                }
            };
        
            sendImageToServer();
            setSelectedImage(null);
            setImagePreview(null);
            return;
        }




        // The text that we send
        var textMessage = document.getElementById("textMsg").value;
        textMessage = textMessage.trim();
        if(textMessage==""){
            document.getElementById("textMsg").value = "";
            return;
        }
        
        
        // Add to server
        var myNewMessage = {sender: true, msgType:"text", content: textMessage, createdAt: time};
        var otherNewMessage = {sender: false, msgType:"text", content: textMessage, createdAt: time};
        if(friendUsername != undefined){
            if (!friends.some(friend => friend.username === friendUsername)) {
                addNewFriend(username,friendUsername, textMessage, "text", time);
                setChangeList(true);
                setMessageInput('');
                //fetchFriendsList();
                console.log(`${friendUsername} is not in your friends list.`);
                socket.emit('send message', "", myNewMessage, username, 1);
                socket.emit('send message', friendID, otherNewMessage, friendUsername, 2);
                return;
              }
              // Handle the case when the friend is not in the list (e.g., display an error message)
             else {
              // Friend is in the friends list
              console.log(`${friendUsername} is in your friends list.`);
              // Continue with the desired logic
            }
          }
        sendText(myNewMessage, username, friendUsername,1)
        .then(sendText(otherNewMessage, friendUsername, username,2))
        .then(document.getElementById("textMsg").value = "");
        setMessageInput('');
        console.log("im here");
        socket.emit('send message', "", myNewMessage, username, 1);
        socket.emit('send message', friendID, otherNewMessage, friendUsername, 2);
    }

    function handleAddPicture() {
        var el = document.getElementById("input-image-id");
        var reader = new FileReader();
        var file = el.files[0];
        if(file){
            setSelectedImage(file);
            reader.onload = (e) => {
            setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        else{
            console.log("No file selected");
        }
    }

    const handleCancelSend = () => {
        // Clear the image preview
        setImagePreview(null);
        // Optionally, clear the input field as well
        setMessageInput('');
      };
      

    function handleAddVideo() {
        var el = document.getElementById("input-video-id");
        var reader = new FileReader();
        var file = el.files[0];
      
        if (file) {
          // Update time
          var today = new Date();
          var hour = addZero(today.getHours());
          var minute = addZero(today.getMinutes());
          var time = hour + ":" + minute;
          
          // Add to the messages
          reader.onload = (e) => {
            // Send the video to the server
            const sendVideoToServer = async () => {
              try {
                const formData = new FormData();
                formData.append("video", file);
      
                const response = await axios.post(
                  `http://localhost:3000/uploadVideo?myUsername=${username}&friendUsername=${friendUsername}&time=${time}`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
      
                // Handle the response from the server
                console.log(response.data);
                var myNewMessage = {
                  sender: true,
                  msgType: "video",
                  content: response.data,
                  createdAt: time,
                };
                var otherNewMessage = {
                  sender: false,
                  msgType: "video",
                  content: response.data,
                  createdAt: time,
                };
                setChangeList(true);
                socket.emit("send message", "", myNewMessage, username, 1);
                socket.emit("send message", friendID, otherNewMessage, friendUsername, 2);
                // Process the response as needed
              } catch (error) {
                console.error(error);
                // Handle error
              }
            };
      
            sendVideoToServer();
          };
      
          reader.readAsDataURL(file);
        } else {
          console.log("No file selected");
        }
    }
    
      
    // Update database of the sender with the new message
    async function sendText(newMessage, sender, receiver, hasUnreadMessages){
        try {
            const encodedMessage = encodeURIComponent(JSON.stringify(newMessage));
            const requestData = {
              message: encodedMessage,
              username: sender,
              friendUsername: receiver,
              hasUnreadMessages: hasUnreadMessages
            };            
            const response = await axios.post(`http://localhost:3000/messages`, requestData);
            console.log(response.data);
            setChangeList(true);
           
        }
        catch (error) {
            console.log(error);
        }
        
    };


    return(
   <div class="chat-messages">
    <div class="chat-header">
        {friendProfile !== "" &&  <img src={`https://drive.google.com/uc?export=view&id=${friendProfile}`} alt="Profile" class="profile-image" />}
        {friendProfile == "" && <img src={defaultProfile} alt="Profile" class="profile-image" />}
        <div class="friend-info">
        <div class="friend-name">{friendName}</div>
        <div class="friend-status">Online</div>
        </div>
    </div>
    <div class="chat-body">
        <ContactMessages currentMsgs={currentMsgs} username={username} />
    </div>
    <div class="chat-footer">
        {!imagePreview && (
        <><textarea
        class="message-input"
        id="textMsg"
        placeholder="Enter text here..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        ></textarea>
        <span class="video-upload">
        <label htmlFor="input-video-id">
            <i class="bi bi-camera-video bi-big"></i>
        </label>
        <input
            class="ng-hide"
            id="input-video-id"
            type="file"
            accept="video/*"
            onInput={handleAddVideo}
        />
        </span>
        <span class="image-upload">
        <label htmlFor="input-image-id">
            <i class="bi bi-image-fill bi-big"></i>
        </label>
        <input
            class="ng-hide"
            id="input-image-id"
            type="file"
            accept="image/*"
            onInput={handleAddPicture}
        />
        </span>
        </> )}
        {imagePreview && (
        <div class="image-preview">
            <img src={imagePreview} alt="Image Preview" class="preview-image" />
            <div className="cancel-button" onClick={handleCancelSend}>
            <i className="bi bi-x"></i>
            </div>
        </div>
        )}
        <i class="bi bi-send bi-big" onClick={handleSend} ></i>
        {!true && <button class="send-button" onClick={handleSend}>Send</button>}
    </div>
    </div>
)};

export default ChatMessages;