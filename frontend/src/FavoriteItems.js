// src/pages/FavoriteItems.js

import React, { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import FavoriteItemCard from './FavoriteItemCard';
import './ItemScrollPage.css';
import logo from './logo.jpg';

let itemsTemp =  [{id:"1", photo:logo, seller:"John Doe", price:"100", description:"A beautiful dress"},
{id:"2", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"3", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"4", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"5", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"6", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"7", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"8", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"9", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"10", photo:logo, seller:"John Doe", price:"100", description:"A beautiful dress"}];


const FavoriteItems = () => {
  const [favoriteItems, setFavoriteItems] = useState(itemsTemp);

  useEffect(() => {
    // Fetch favorite items from the server
    const fetchFavoriteItems = async () => {
      // Replace with your API URL and authentication if required
      const response = await fetch('https://api.example.com/favorite-items');
      const data = await response.json();
      setFavoriteItems(data);
    };

    fetchFavoriteItems();
  }, []);

  const handleRemove = (id) => {
    // Remove the item from the favorite items list
    setFavoriteItems(favoriteItems.filter((item) => item.id !== id));

    // Call the server to remove the item from the user's favorites
    // Replace with your API URL and authentication if required
    fetch(`https://api.example.com/favorite-items/${id}`, {
      method: 'DELETE',
    });
  };

  return (
    <div>
      <NavigationBar />
      <div className="category-header">
        <h1>Favorite Items</h1>
      </div>
      <div className="filter-bar"></div>
      <div className="container">
        <div className="item-grid">
          {favoriteItems.map((item) => (
            <FavoriteItemCard key={item.id} {...item} onRemove={handleRemove} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoriteItems;
