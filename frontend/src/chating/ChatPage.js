
/*
import ChatingWith from './ChatingWith';
import './ChatPage.css';

//import Message from './Message';
import TopLeftChat from './TopLeftChat';
import userMap from './usersFolder/usersList.js';
import { useLocation } from "react-router-dom";
import { useEffect, useState , useRef} from 'react';
import MessagesListResult from './MessagesListResult';
import SendMessage from './SendMessage'
import AddFriend from './AddFriend';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';

//import React, { useRef } from "react";
var friendsFlag =0;

function ChatPage() {

    const { state } = useLocation();
    const { username } = state;
    //const divRef = useRef();

    const [msgs, setMsgs] = useState([]);
    const theFriendTop = useRef(''); 
    const [friendTop, setFriendTop] = useState('');
    const [friends, setFriends] = useState([]);


    //list of the friends name

    const [userFriends, setUserFriends] = useState(userMap);

   

    //triger for 
    const [buttonPopup, setButtonPopup] = useState(false);
    const [sendPopup, setSendPopup] = useState(false);

    const [messageSent, setMessageSent] = useState(false);
    const [messageSent2, setMessageSent2] = useState(true);

    // app signalR
    const [ connection, setConnection ] = useState(null);
    const latestChat = useRef(null);
    latestChat.current = msgs;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7100/MyHub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    
    
                    connection.on('ChangeReceived', (usersent, sender) => {

                       
                       if (usersent == username){
                           // to update all the chats

                           
                           //   doChoose(usersent);
                           addLeftFriend();
                           
                           // to update the current open chat.
                           if (theFriendTop.current == sender){
                               
                               doChoose(sender);
                           }
                           
                           
                       }
                       
                    
                        //setChat(updatedChat);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);




    //function for changing the chat state
    async function chageTheState(chatFriend) {
        //deep clone for rendring
        var newChatFriend = [...chatFriend];
        setMsgs(msgs => newChatFriend);
        //updateScroll();
    }

    // change the state when click on user
    const doChoose = async function (userFriend) {

        //get the messages
        var srtingFetch = 'https://localhost:7100/api/Contacts/';
        const result = await fetch(srtingFetch.concat(username, '/',userFriend, '/messages'));
        
        const myMesg = await result.json();
        var tempMesg = [];
        for (let i = 0; i < myMesg.length; i++) {
            var content = myMesg[i].content;
            var created = myMesg[i].created;
            var sent = myMesg[i].sent;
            var type = "text";
            tempMesg.push({ type: "text", text: content, time: created, mine: sent})
        }
        chageTheState(tempMesg)
        //setMsgs(msgs => tempMesg);
        setFriendTop(friendTop => userFriend);
        theFriendTop.current = userFriend;
        setSendPopup(true);
        setMessageSent (messageSent => !messageSent);
        setMessageSent2 (messageSent2 => !messageSent2)
       
    }



    

   
    async function plusFriend() {
        var writtenFriend = document.getElementById("writtenFriend").value;
        var friendDisplayName = document.getElementById("friendDisplayName").value;
        var friendServer = document.getElementById("friendServer").value;
        const result = await fetch('https://localhost:7100/api/Contacts/users');
        const users = await result.json();
        var j = 0;
        var exist = 0;
        for (; j < users.length; j++) {
            if (users[j].id == writtenFriend && users[j].server == friendServer && users[j].name == friendDisplayName) {
                exist = 1;
            }
        }
        if (exist == 0) {
            console.log("dont exist");
            return;
        }
        var address = 'https://localhost:7100/api/Contacts/'.concat(username);
        const res = await fetch(address);
        const friendsData = await res.json();
       
        var i = 0;
        for (; i < friendsData.length; i++) {
            if (writtenFriend == friendsData[i].id && friendDisplayName == friendsData[i].name && friendServer == friendsData[i].server) {
                
                return;
            }
        }

        const user = {connected:username, id:writtenFriend, name:friendDisplayName, server:friendServer};
        
        try{
            await fetch('https://localhost:7100/api/Contacts', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(user)
            });
            setButtonPopup(false);
        }
        catch(err){
            console.error(err);
        }
        addLeftFriend();

        const invite = {from:username, to:writtenFriend, server:friendServer};
        try{
            var srtingFetch = 'https://localhost:7100/api/Contacts/'.concat(username, '/contacts');
            const result2 = await fetch(srtingFetch);
            

            const contacts = await result2.json();
            var i  = 0;
            var serverFriend;
            for (;i<contacts.length; i++){
                if(contacts[i].id == writtenFriend){
                    serverFriend = contacts[i].server;
                    break;
                }
            }
            await fetch('https://'.concat(serverFriend,'/api/invitations'), {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(invite)
            });
        }

        catch(err){
            console.error(err);
        }
        try {
            await connection.send('Changed', writtenFriend, username);
        }
        catch(e) {
            console.log(e);
        }



    }


    const plus = function (newUserMap) {
        setUserFriends(userFriends => newUserMap);
    }

    //var flag = 0;

    async function addLeftFriend() {

        var srtingFetch = 'https://localhost:7100/api/Contacts/';
        const result = await fetch(srtingFetch.concat(username));
        const myUsers = await result.json();
        var tempFriends = [];
        for (let i = 0; i < myUsers.length; i++) {
            // obj is the friend name
            var obj = myUsers[i].id;
            var name = myUsers[i].name;
            var myImage = sami;
            var last_message = myUsers[i].last;
            var last_message_type = "text";
            var lastTime = myUsers[i].lastDate;
           
            tempFriends.push({ userFriend: obj, displayName: name, message: last_message, lastMessageType: last_message_type, img: myImage, time: lastTime })
            tempFriends.sort((a, b) => a.time < b.time ? 1 : -1)
        }

        
        setFriends(friends => tempFriends);
        friendsFlag =1;
        //return;
        
    }
    //var friends = [];
    if (friendsFlag == 0){
      addLeftFriend();  
    }   
    
    const userList = friends.map((user, key) => {
        return <User doChoose={doChoose} {...user} key={key} />
    });
    
    


    return (

        <>
            <div className="row chating">
                <div className="col-3">
                    <div className='my-user'>
                        <TopLeftChat plus={plus} username={username} setButtonPopup={setButtonPopup} />
                    </div>
                    <div className="chatList">
                        {userList}
                    </div>
                </div>
                <div className="col-9 right-side">

                    <div className='friend-top'>
                        <ChatingWith myUsername={username} friendTop={friendTop} changeTheMsgs={chageTheState} />
                    </div>
                    <div className="messages" id="messages">
                        <div className="chatings" id="chatings">
                            <MessagesListResult chatFriend={msgs} />
                        </div>
                    </div>

                    <div>
                        <SendMessage trigger={sendPopup} myUsername={username} addressee={friendTop} doChoose={doChoose} addLeftFriend={addLeftFriend} connection={connection} />
                    </div>

                </div>
                <AddFriend trigger={buttonPopup} setTrigger={setButtonPopup}>
                    <div className="titleCloseBtn">
                        <button onClick={() => { setButtonPopup(false); }}>X</button>
                    </div>
                    <h1>Add Friend</h1>
                    <input id="writtenFriend" placeholder="Enter friend's username"></input>
                    <input id="friendDisplayName" placeholder="Enter friend's display name"></input>
                    <input id="friendServer" placeholder="Enter friend's server"></input>
                    <button className="add-button" onClick={() => plusFriend()}>Add</button>
                </AddFriend>

            </div>




        </>
    );
}

export default ChatPage;

*/