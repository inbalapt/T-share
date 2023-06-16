import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemCard.css';
import axios from 'axios'; // Import axios if not already imported
import { useEffect } from 'react';

const isItemFavorite = async(username, id)=>{
  try {
    const response = await axios.get(`http://localhost:3000/item/isFavItem?username=${username}&id=${id}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error(error);
  }
}

const ItemCard = ({ username, _id, pictures, sellerUsername, sellerFullName, price, description, item, flag }) => {
  console.log(username);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  console.log("flag is : " + flag);
  const picture1 = pictures[0];
  console.log(picture1);
  const photo = `https://drive.google.com/uc?export=view&id=${picture1}`;
  console.log(photo);
  console.log(_id);
  const [isMyFeed, setIsMyFeed] = useState(false)
  
  useEffect(()=>{
    if(sellerUsername === username){
      setIsMyFeed(true);
    } else{
      setIsMyFeed(false);
    }
  }, [sellerUsername]);
  

  useEffect(()=>{
    isItemFavorite(username,_id)
    .then(isFavorite => {
      if (isFavorite) {
        setIsFavorite(true)
      } else {
        setIsFavorite(false)
      }
    })
  }, [_id]);
  

  const handleClick = (e) => {
    if (e.target.closest('.favorite-button') || e.target.closest('.chat-button') || e.target.closest('.text-muted')) {
      e.stopPropagation();
      return;
    }
    navigate(`/item/${_id}`, { state: { username: username} });
  };

  const handleSellerName = async (e)=>{
    navigate(`/userPage/${sellerUsername}`, { state: { username: username} });
  }

  const handleFavoriteClick = async (e) => { // Add async keyword here
    e.stopPropagation();
    
    
    if(!isFavorite){
      setIsFavorite(true);
      try {
      const response = await axios.post(`http://localhost:3000/item/addFavoriteItem?username=${username}&id=${_id}`);
      console.log(response.data);
      return response.data;
      } catch (error) {
        console.error(error);
      }
    } else{
      setIsFavorite(false);
      try {
        const response = await axios.delete(`http://localhost:3000/item/removeFavoriteItem?username=${username}&id=${_id}`);
        console.log(response.data);
        return response.data;
        } catch (error) {
          console.error(error);
        }
    }
    
  };

  const handleChatClick = (e) => {
    const automaticMessage = `Hi, I'm interested in this ${description}, http://localhost:3001/item/${_id}`
    e.stopPropagation();
    navigate("../ChatPage", { state: { username: username, friendUsername: sellerUsername, automaticMessage } });
  };

  return (
    <div className="card item-card" onClick={handleClick}>
      
      <div className="item-overlay">
      {!isMyFeed && (
        <>
        <button className="btn btn-light favorite-button" onClick={handleFavoriteClick}>
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
        <button className="btn btn-light chat-button" onClick={handleChatClick}>
          <i className="bi bi-chat-dots"></i>
        </button>
        </>)}
      </div>
      <img src={photo} className="card-img-top" alt={description} />
      <div className="card-body">
        <h5 className="card-title">{description}</h5>
        {!isMyFeed && !flag && (<p className="card-text">
        <small className="text-muted" onClick={handleSellerName}>Seller: {sellerFullName}</small>
        </p>)}
        <p className="card-text price">${price}</p>
      </div>
    </div>
  );
};

export default ItemCard;
