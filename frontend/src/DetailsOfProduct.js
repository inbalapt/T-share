// src/components/DetailsOfProduct.js
import React from 'react';
import './DetailsOfProduct.css';
import { useNavigate } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import { useState,useEffect } from 'react';

const BuyConfirmationModal = ({ onConfirmBuy, onCancelBuy }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Do you want to buy the item?</h3>
        <div className="modal-buttons">
          <i class="bi bi-x-circle" onClick={onCancelBuy}></i>
          <i class="bi bi-check-circle" onClick={onConfirmBuy}></i>
        </div>
      </div>
    </div>
  );
};

const isItemFavorite = async(username, id)=>{
  try {
    const response = await axios.get(`http://localhost:3000/isFavItem?username=${username}&id=${id}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error(error);
  }
}

const DetailsOfProduct = ({ username, seller, description, price, size, collectionPoint, condition, color, brand, sellerUsername, pictures, id }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const [showBuyConfirmation, setShowBuyConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailMessage,setShowFailMessage] = useState(false);

  useEffect(()=>{
    isItemFavorite(username,id)
    .then(isFavorite => {
      if (isFavorite) {
        setIsFavorite(true)
      } else {
        setIsFavorite(false)
      }
    })
  }, [id]);

  const handleChatClick = (e) => {
    const automaticMessage = `Hi, I'm interested in this ${description}, http://localhost:3001/item/${id}`
    e.stopPropagation();
    navigate("../ChatPage", { state: { username: username, friendUsername: sellerUsername, automaticMessage }});
  };

  async function handleBuyClick(){
    setShowBuyConfirmation(true);
  }

  const handleFavoriteClick = async (e) => { // Add async keyword here
    e.stopPropagation();
    
    
    if(!isFavorite){
      setIsFavorite(true);
      try {
      const response = await axios.post(`http://localhost:3000/addFavoriteItem?username=${username}&id=${id}`);
      console.log(response.data);
      return response.data;
      } catch (error) {
        console.error(error);
      }
    } else{
      setIsFavorite(false);
      try {
        const response = await axios.delete(`http://localhost:3000/removeFavoriteItem?username=${username}&id=${id}`);
        console.log(response.data);
        return response.data;
        } catch (error) {
          console.error(error);
        }
    }
    
    // Save the favorite item to the server !!! important
  };

  const handleConfirmBuy = async() => {
    // Perform the buy operation or any additional logic
    try {
      const response = await axios.post(`http://localhost:3000/buyItem?username=${username}&sellerUsername=${sellerUsername}&price=${price}&itemId=${id}`);
      //console.log(response.data);
      console.log(response.status); // Log the response status
     
      // Close the confirmation modal
      setShowBuyConfirmation(false);
      setShowSuccessMessage(true);
      // Close the confirmation modal after a few seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        // Navigate to the homepage
        navigate("../HomePage", { state: { username: username } });
      }, 3000); // Adjust the duration as needed
  
      return response.data;
    } catch (error) {
      // Close the confirmation modal
      setShowBuyConfirmation(false);
      console.log("hi");
      setShowBuyConfirmation(false);
      setShowFailMessage(true);
      setTimeout(() => {
        setShowFailMessage(false);
        navigate("../HomePage", { state: { username: username } });
      }, 3000); // Adjust the duration as needed
      console.error(error);
    }
    
  };

  const handleCancelBuy = () => {
    // Close the confirmation modal
    setShowBuyConfirmation(false);
  };

  return (
    <div className="details-of-product">
      {brand && (<p className="brand">{brand}</p>)}
      <h2 className="description">{description}</h2>
      <p className="price-details">Price: {price}</p>
      <p className="size">Size: {size}</p>
      <p className="condition">Condition: {condition}</p>
      {color && (<p className="color">Color: {color}</p>)}
      
      
      <p className="seller">Seller: {seller}</p>
      <p className="collection-point">From: {collectionPoint}</p>
      {username != sellerUsername && !showSuccessMessage && !showFailMessage &&
      <>
      <button className="contact-seller-btn" onClick={handleBuyClick}>Buy</button>
      
        <button className="btn btn-light favorite-button details-btns" onClick={handleFavoriteClick}>
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
        <button className="btn btn-light chat-button details-btns" onClick={handleChatClick}>
          <i className="bi bi-chat-dots"></i>
        </button>
      
      </>
      }
      {showBuyConfirmation && (
        <BuyConfirmationModal
          onConfirmBuy={handleConfirmBuy}
          onCancelBuy={handleCancelBuy}
        />
      )}
       {showSuccessMessage && (
        <div className="message-item success">
          The item was bought successfully!
        </div>
      )}
      {showFailMessage &&(
        <div className="message-item fail">
          You don't have enough credit. 
        </div>
      )}
    </div>
  );
};

export default DetailsOfProduct;
