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
  {/* name: 'Change Password', path: 'change-password', icon: '🔒' */}
  const menuItems = [
    { name: 'Account overview', path: 'overview', icon: <i class="bi bi-person-circle"></i> },
    { name: 'My details', path: 'mydetails', icon: <i class="bi bi-clipboard-data"></i> },
    { name: 'Upload Product', path: 'upload', icon: <i class="bi bi-upload"></i> },
    { name: 'My Orders', path: 'orders', icon: <i class="bi bi-cart-check"></i> },
    { name: 'My Products', path: 'products', icon: <i class="bi bi-basket3"></i> },
    { name: 'About Us', path: 'about', icon: <i class="bi bi-question-lg"></i> },
    { name: 'Sign Out', path: 'sign-out', icon: <i class="bi bi-door-closed"></i>},
  ];

  return (
    <div className="user-account-main-menu">
      <div className="user-info">
        <div className="initials">
          
          {firstChar}
          {secondChar}
        </div>
        <h2 className="menu-full-name">Hi, {fullName}</h2>
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
