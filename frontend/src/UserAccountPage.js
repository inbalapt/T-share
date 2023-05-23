import React, { useState } from 'react';
import UserAccountMenu from './UserAccountMenu';
import UserAccountContent from './UserAccountContent';
import './UserAccountPage.css';  // <-- import here
import { useLocation } from 'react-router-dom';

const UserAccountPage = () => {
  const location = useLocation();
  const username = location.state.username;
  const [selectedMenuItem, setSelectedMenuItem] = useState('overview');

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  return (
    <div className="user-account-page">
      <div className="user-account-menu">  {/* <-- apply class here */}
        <UserAccountMenu
          onMenuItemClick={handleMenuItemClick}
          selectedMenuItem={selectedMenuItem}
        />
      </div>
      <div className="user-account-content">  {/* <-- apply class here */}
        <UserAccountContent selectedMenuItem={selectedMenuItem} username={username}/>
      </div>
    </div>
  );
};

export default UserAccountPage;
