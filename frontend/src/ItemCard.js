import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemCard.css';

const ItemCard = ({username, id, pictures, sellerUsername,sellerFullName, price, description }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const picture1 = pictures[0];
  const photo = `http://localhost:3000/item-uploads/${picture1}`;
  console.log(photo);

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
    //const automaticMessage = `Hi, I'm interested in this ${description} :)`
    e.stopPropagation();
    navigate("../ChatPage", { state: {username: username, friendUsername: sellerUsername, photo: `http://localhost:3000/item-uploads/${picture1}`}});
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
      <img src={`http://localhost:3000/item-uploads/${picture1}`} className="card-img-top" alt={description} />
      <div className="card-body"> 
        <h5 className="card-title">{description}</h5>
        <p className="card-text">
          <small className="text-muted">Seller: {sellerFullName}</small>
        </p>
        <p className="card-text price">${price}</p>
      </div>
    </div>
  );
};

export default ItemCard;
