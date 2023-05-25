import React from 'react';
import './UserAccountMenu.css';

const UserAccountMenu = ({ onMenuItemClick, selectedMenuItem, fullName }) => {
  // Mock user data
  const user = {
    firstName: 'John',
    lastName: 'Smith',
  };
  const parts = fullName.split(' '); 
  const firstName = parts[0]; 
  const lastName = parts.slice(1).join(' '); 

  const firstChar = firstName[0]? firstName[0].toUpperCase() : '';
  const secondChar = lastName[0] ? lastName[0].toUpperCase() : '';

  const menuItems = [
    { name: 'Account overview', path: 'overview', icon: '👤' },
    { name: 'My details', path: 'mydetails', icon: '📝' },
    { name: 'Upload Product', path: 'upload', icon: '⬆️' },
    { name: 'My Orders', path: 'orders', icon: '🛍️' },
    { name: 'Change Password', path: 'change-password', icon: '🔒' },
    { name: 'About Us', path: 'about', icon: '❓' },
    { name: 'Sign Out', path: 'sign-out', icon: '🚪' },
  ];

  return (
    <div className="user-account-main-menu">
      <div className="user-info">
        <div className="initials">
          {firstChar}
          {secondChar}
        </div>
        <h2>Hi, {fullName}</h2>
      </div>
      <div className="menu-items">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${selectedMenuItem === item.path ? 'active' : ''}`}
            onClick={() => onMenuItemClick(item.path)}
          >
            <span className="icon">{item.icon}</span>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAccountMenu;
