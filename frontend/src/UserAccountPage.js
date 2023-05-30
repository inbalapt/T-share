import React, { useEffect, useState } from 'react';
import UserAccountMenu from './UserAccountMenu';
import UserAccountContent from './UserAccountContent';
import './UserAccountPage.css';  // <-- import here
import { useLocation } from 'react-router-dom';
import axios from 'axios';
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

  return (
    <div className="user-account-page">
      <div className="user-account-menu">  {/* <-- apply class here */}
        <UserAccountMenu
          onMenuItemClick={handleMenuItemClick}
          selectedMenuItem={selectedMenuItem}
          fullName={fullName}
          
        />
      </div>
      <div className="user-account-content">  {/* <-- apply class here */}
        <UserAccountContent selectedMenuItem={selectedMenuItem} username={username} updateProducts={updateProducts} setUpdateProducts={setUpdateProducts}/>
      </div>
    </div>
  );
};

export default UserAccountPage;
