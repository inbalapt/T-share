// src/components/DetailsOfProduct.js
import React from 'react';
import './DetailsOfProduct.css';
import { useNavigate } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa';
import axios from 'axios';

const DetailsOfProduct = ({ username, seller, description, price, size, collectionPoint, condition, color, brand, sellerUsername, pictures, id }) => {
  const navigate = useNavigate();
  const handleChatClick = (e) => {
    //const automaticMessage = `Hi, I'm interested in this ${description} :)`
    e.stopPropagation();
    navigate("../ChatPage", { state: { username: username, friendUsername: sellerUsername, photo:pictures[0]}});
  };

  async function handleBuyClick(){
    try{
      const response = await axios.post(`http://localhost:3000/buyItem?username=${username}&sellerUsername=${sellerUsername}&price=${price}&itemId=${id}`)
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  
  }

  return (
    <div className="details-of-product">
      <p className="seller">Seller: {seller}</p>
      <h2 className="description">{description}</h2>
      <p className="size">Size: {size}</p>
      <p className="collection-point">Location: {collectionPoint}</p>
      <p className="condition">Condition: {condition}</p>
      <p className="color">Color: {color}</p>
      <p className="brand">Brand: {brand}</p>
      <p className="price">Price: {price}</p>
      {username != sellerUsername && <button className="contact-seller-btn" onClick={handleChatClick}>Contact the seller</button>}
      {username != sellerUsername && <button className="contact-seller-btn" onClick={handleBuyClick}>Buy</button>}
    </div>
  );
};

export default DetailsOfProduct;
