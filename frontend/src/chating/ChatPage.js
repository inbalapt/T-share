import { useLocation } from "react-router-dom";
import { useEffect, useState , useRef} from 'react';
import axios from 'axios';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import NavigationBar from '../NavigationBar';



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
    const [friendUsername,setFriendUsername] = useState(location.state?.friendUsername);
    const [automaticMessage,setAutomaticMessage] = useState(location.state?.automaticMessage);
    const itemPhoto = location.state?.photo;
    //const [activeChat, setActiveChat] = useState(null);
    //const [msgs, setMsgs] = useState([]);
    //const theFriendTop = useRef(''); 
   // const [friendUsername, setFriendUsername] = useState('');
    const [friendsList, setFriendsList] = useState([]);
    const [currentMsgs, setCurrentMsgs] = useState([]); 
    const [myName, setMyName] = useState("");
    const [changeList, setChangeList] = useState(false);
    
    const [friendProduct, setFriendProduct] = useState(false);
    useEffect(()=>{
      if(automaticMessage){
        setFriendProduct(true);
      } else{
        setFriendProduct(false);
      }
    }, [friendUsername]);
    

    

    useEffect(() => {
      const fetchFriendsList = async () => {
        const friends = await getFriendsList(username);
        console.log(friends);
        setFriendsList(friends);
        setChangeList(false);
      };
      fetchFriendsList();
    }, [changeList]);

    useEffect(()=>{
      if(friendUsername != undefined){
        chooseFriend(friendUsername);
      }
    }, [friendUsername]);

    useEffect(() => {
        const fetchFriendsList = async () => {
          const friends = await getFriendsList(username);
          console.log(friends);
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
      console.log("enter");
        if(friendProduct){
          setAutomaticMessage('');
        }
        console.log("automessage is " + automaticMessage)
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
    <div>
      <NavigationBar username={username}/>
      <div className="chat-container">
          {friendUsername && <ChatMessages username={username} friendUsername={friendUsername} currentMsgs={currentMsgs} setCurrentMsgs={setCurrentMsgs} getFullname={getFullname} automaticMessage={automaticMessage} itemPhoto={itemPhoto} friends={friendsList} setChangeList={setChangeList}/>}
          <ChatList username={username} myFullname={myName} friendsList={friendsList} setFriendUsername={setFriendUsername} chooseFriend={chooseFriend} getFullname={getFullname} setFriendProduct={setFriendProduct}/>
      </div>
    </div>
  );

}


export default ChatPage;

