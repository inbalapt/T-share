// src/components/FavoriteItemCard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FavoriteItemCard.css';

const FavoriteItemCard = ({username, _id, pictures, sellerUsername, sellerFullName, price, size,itemLocation, category, condition, color, brand, description, onRemove }) => {
  const navigate = useNavigate();

  const photo = `https://drive.google.com/uc?export=view&id=${pictures[0]}`;
  const seller = sellerFullName;

  const handleClick = (e) => {
    if (e.target.closest('.remove-button') || e.target.closest('.text-muted')) {
      e.stopPropagation();
      return;
    }
    navigate(`/item/${_id}`, { state: { username: username} });
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(_id);
  };

  const handleSellerName = async (e)=>{
    navigate(`/userPage/${sellerUsername}`, { state: { username: username} });
  }

  const handleChatClick = (e) => {
    const automaticMessage = `Hi, I'm interested in this ${description}, http://localhost:3001/item/${_id}`
    e.stopPropagation();
    navigate("../ChatPage", { state: { username: username, friendUsername: sellerUsername, automaticMessage } });
  };

  return (
    <div className="card favorite-item-card" onClick={handleClick}>
      <div className="item-overlay">
        <button className="btn btn-light remove-button" onClick={handleRemoveClick}>
          <i className="bi bi-trash"></i>
        </button>
        <button className="btn btn-light chat-button-fav" onClick={handleChatClick}>
          <i className="bi bi-chat-dots"></i>
        </button>
      </div>
      <img src={photo} className="card-img-top" alt={description} />
      <div className="card-body">
        <h5 className="card-title">{description}</h5>
        <p className="card-text">
          <small className="text-muted" onClick={handleSellerName}>Seller: {seller}</small>
        </p>
        <p className="card-text price">${price}</p>
      </div>
    </div>
  );
};

export default FavoriteItemCard;
