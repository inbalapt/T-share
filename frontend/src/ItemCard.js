import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemCard.css';

const ItemCard = ({ id, photo, seller, price, description }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.target.closest('.favorite-button') || e.target.closest('.chat-button')) {
      e.stopPropagation();
      return;
    }
    navigate(`/item/${id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Save the favorite item to the server !!! important
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    navigate(`/ChatPage/${seller}`);
  };

  return (
    <div className="card item-card" onClick={handleClick}>
      <div className="item-overlay">
        <button className="btn btn-light favorite-button" onClick={handleFavoriteClick}>
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
        <button className="btn btn-light chat-button" onClick={handleChatClick}>
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

export default ItemCard;
