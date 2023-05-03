// src/components/Item.js

import React from 'react';
import './Item.css';

const Item = ({ id, photo, seller, price, description }) => {
    const handleClick = () => {
      window.location.href = `/item/${id}`;
    };
  
    return (
      <div className="card item-card" onClick={handleClick}>
        <div className="item-overlay">
          <button className="btn btn-light favorite-button">
            <i className="bi bi-heart"></i>
          </button>
          <button className="btn btn-light chat-button">
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
  
  export default Item;