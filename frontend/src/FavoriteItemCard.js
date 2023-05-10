// src/components/FavoriteItemCard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FavoriteItemCard.css';

const FavoriteItemCard = ({ id, photo, seller, price, description, onRemove }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.target.closest('.remove-button')) {
      e.stopPropagation();
      return;
    }
    navigate(`/item/${id}`);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(id);
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    navigate(`/chat/${seller}`);
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
          <small className="text-muted">Seller: {seller}</small>
        </p>
        <p className="card-text price">${price}</p>
      </div>
    </div>
  );
};

export default FavoriteItemCard;
