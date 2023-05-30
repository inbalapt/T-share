import React, { useEffect } from 'react';
import UploadItem from './UploadItem';
import MyDetails from './MyDetails';
import AccountOverview from './AccountOverview';
import MyOrders from './MyOrders';
import MyUploads from './MyUploads';
//import './userAccount.css';

const UserAccountContent = ({ selectedMenuItem, username, updateProducts, setUpdateProducts }) => {
  
  return (
    <div className="user-account-content">
    { /*selectedMenuItem === 'mydetails' && <MyDetails /> */}
    {selectedMenuItem === 'mydetails' && <MyDetails username={username}/>}
    {selectedMenuItem === 'upload' && <UploadItem username={username} setUpdateProducts={setUpdateProducts}/>}
    {selectedMenuItem === 'overview' && <AccountOverview username={username} />}
    {selectedMenuItem === 'orders' && <MyOrders username={username}/> }
    {selectedMenuItem === 'products' && <MyUploads username={username} setUpdateProducts={setUpdateProducts} updateProducts={updateProducts}/>}
  </div>
  );
};

export default UserAccountContent;
