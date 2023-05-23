import React from 'react';
import UploadItem from './UploadItem';
import AccountOverview from './AccountOverview';
//import './userAccount.css';

const UserAccountContent = ({ selectedMenuItem, username }) => {
  return (
    <div className="user-account-content">
    { /*selectedMenuItem === 'mydetails' && <MyDetails /> */}
    {selectedMenuItem === 'upload' && <UploadItem username={username}/>}
    {selectedMenuItem === 'overview' && <AccountOverview />}
    { /*selectedMenuItem === 'orders' && <MyOrders /> */}
    {/* You can continue this for all your different menu items */}
  </div>
  );
};

export default UserAccountContent;