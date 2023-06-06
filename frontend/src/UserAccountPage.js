import React, { useEffect, useState } from 'react';
import UserAccountMenu from './UserAccountMenu';
import UserAccountContent from './UserAccountContent';
import './UserAccountPage.css';  // <-- import here
import { useLocation , Link ,useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.jpeg'
import UploadItem from './UploadItem';

// Get name of the user
const getFullname = async (username,setFullName) => {
  try {
    const response = await axios.get(`http://localhost:3000/getFullname?username=${username}`);
    setFullName(response.data.fullName);
    return response.data.fullName;
  } catch (error) {
    console.error(error);
  }
};



const UserAccountPage = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const username = location.state.username;
  const [selectedMenuItem, setSelectedMenuItem] = useState('overview');
  const [fullName,setFullName] = useState("");
  const [updateProducts, setUpdateProducts] = useState(false);

  useEffect(()=>{
    getFullname(username, setFullName);
  },[username]);

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  function handleHome(){
    navigate("../HomePage", { state: {username: username }});
  }

  return (
    <div className="user-account-page">
      <div className='user-account-header'> 
      
        <div className="link-return"><img className='logo-img-return' src={logo} alt="Logo" onClick={handleHome}/></div>

        <div className='my-account-head'> <h1 className='headline-my-account'>MY ACCOUNT</h1> </div>
      </div>

      <div className='user-account-box'>
        <div className="user-account-menu">  {/* <-- apply class here */}
          <UserAccountMenu
            onMenuItemClick={handleMenuItemClick}
            selectedMenuItem={selectedMenuItem}
            fullName={fullName}
            
          />
        </div>
        <div className="user-account-content" >  {/* <-- apply class here */}
          <UserAccountContent selectedMenuItem={selectedMenuItem} username={username} updateProducts={updateProducts} setUpdateProducts={setUpdateProducts}/>
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;
