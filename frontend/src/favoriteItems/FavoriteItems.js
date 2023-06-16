import React, { useState, useEffect } from 'react';
import NavigationBar from '../NavigationBar';
import FavoriteItemCard from './FavoriteItemCard';
import '../mainPage/ItemScrollPage.css';
import './FavoriteItems.css'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const getFavItems = async (username) => {
  try {
    const response = await axios.get(`http://localhost:3000/item/getFavItems?username=${username}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  }
};

const FavoriteItems = () => {
  const location = useLocation();
  const username = location.state.username;
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      const items = await getFavItems(username);
      setFavoriteItems(items);
    };

    fetchFavoriteItems();
  }, [username]);

  const handleRemove = async (id) => {
    setFavoriteItems(favoriteItems.filter((item) => item._id !== id));

    try {
      /*const data = {
        username: username,
        id: _id
      };*/
      await axios.delete(`http://localhost:3000/item/removeFavoriteItem`, { data: { username, id } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <NavigationBar username={username} />
      <div className="category-header-favorite"  style={{ backgroundImage:`url(${`/pictures/favorites.jpg`})`}}>
        <h1>Favorite Items</h1>
      </div>
      <div className="filter-bar"></div>
      <div className="container">
        <div className="item-grid">
          {favoriteItems.map((item) => (
            <FavoriteItemCard key={item._id} {...item} onRemove={handleRemove} username={username} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoriteItems;
