import React from 'react';
import UploadItem from './UploadItem';
import MyDetails from './MyDetails';
import AccountOverview from './AccountOverview';
import MyOrders from './MyOrders';
//import './userAccount.css';

const UserAccountContent = ({ selectedMenuItem, username }) => {
  return (
    <div className="user-account-content">
    { /*selectedMenuItem === 'mydetails' && <MyDetails /> */}
    {selectedMenuItem === 'mydetails' && <MyDetails username={username}/>}
    {selectedMenuItem === 'upload' && <UploadItem username={username}/>}
    {selectedMenuItem === 'overview' && <AccountOverview />}
    { selectedMenuItem === 'orders' && <MyOrders /> }
    {/* You can continue this for all your different menu items */}
  </div>
  );
};

export default UserAccountContent;
