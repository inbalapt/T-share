import React from 'react';
import './UserProfilePage.css';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';
import NavigationBar from './NavigationBar';
import defaultProfile from './chating/defaultProfile.png';

const getUserItems = async (userProName, page, limit, setItems) => {
  try {
    console.log(userProName)
    const response = await axios.get(`http://localhost:3000/getUserItems?userProName=${userProName}&page=${page}&limit=${limit}`);
    console.log(response.data);
    setItems(response.data.items);
    return response.data.totalPages; // Return the total number of pages from the server
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
  
  const getProfilePhoto = async (username)=>{
    try {
      const response = await axios.get(`http://localhost:3000/getProfile?username=${username}`);
      console.log(response.data.image);
      return response.data.image;
    } catch (error) {
      console.error(error);
    }
  };

  const checkFollowing= async (username,userProName, setIsFollowed) =>{
    try {
      const response = await axios.get(`http://localhost:3000/checkIfFollowed?username=${username}&userProName=${userProName}`);
      setIsFollowed(response.data.followed);
      console.log(response.data.followed);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };


  function UserProfilePage() {
    const { userProName } = useParams();
    const [items, setItems] = useState([]);
    const location = useLocation();
    const username = location.state.username;
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(28);
    const [totalPages, setTotalPages] = useState(0);
    const [userFullName, setUserFullName] = useState(""); // Declare userFullName
    const [userProfile, setUserProfile] = useState(""); // Declare userProfile
    const [isFollowed, setIsFollowed] = useState(false);
    useEffect(() => {
      const fetchItems = async () => {
        console.log(userProName);
        const totalPages = await getUserItems(userProName, currentPage, itemsPerPage, setItems);
        // Optionally, you can store the total number of pages in a state variable if needed
        setTotalPages(totalPages);
      };
      fetchItems();
    }, [userProName, currentPage, itemsPerPage, username]);
  
    useEffect(() => {
      const checkIfFollowed = async () => {
        await checkFollowing(username,userProName, setIsFollowed);
      };
      checkIfFollowed();
    }, [userProName, username]);
  

    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    };
  
    const handleNextPage = () => {
      // Assuming you have the total number of pages stored in a state variable named 'totalPages'
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        const fullName = await getFullname(userProName);
        const image = await getProfilePhoto(userProName);
  
        setUserFullName(fullName);
        setUserProfile(image);
      };
  
      fetchUserDetails();
    }, [userProName]);

    async function followUser() {
      try {
        var body = {
          username: username,
          userProName: userProName
      }
        const response = await axios({
          method: 'post',
          url: 'http://localhost:3000/followUser',
          data: body
      })
        console.log(response.data);
        setIsFollowed(true);
      } catch (error) {
        console.log('Error following user:', error);
      }
    }

    async function unfollowUser() {
      try {
        var body = {
          username: username,
          userProName: userProName
      }
        const response = await axios({
          method: 'delete',
          url: 'http://localhost:3000/unfollowUser',
          data: body
      })
        console.log(response.data);
        setIsFollowed(false);
      } catch (error) {
        console.log('Error following user:', error);
      }
    }
    


  return (
    <div className="user-profile-container">
      <NavigationBar />
      <div className="user-header-profile">
      <div className="user-profile">
       
        {userProfile !== "" && <img src={`https://drive.google.com/uc?export=view&id=${userProfile}`} alt="Profile" className="profile-image" />}
        {userProfile == "" && <img src={defaultProfile} alt="Profile" className="profile-image" />}
        
        <h2 className="profile-name">{userFullName}</h2>
        {userProName != username && !isFollowed &&  (<button className="follow-button" onClick={followUser}>Follow</button>)}
        {userProName != username && isFollowed &&  (<><button className="following-button" onClick={unfollowUser}><i class="bi bi-check-lg"></i>Following</button></>)}
      </div>
      </div>
      <div className="item-grid">
        {items.map(item => (
          <ItemCard key={item.id} {...item} username={username} flag={true}/>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{currentPage}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
