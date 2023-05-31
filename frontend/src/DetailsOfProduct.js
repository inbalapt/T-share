// src/components/DetailsOfProduct.js
import React from 'react';
import './DetailsOfProduct.css';
import { useNavigate } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import { useState } from 'react';

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

const DetailsOfProduct = ({ username, seller, description, price, size, collectionPoint, condition, color, brand, sellerUsername, pictures, id }) => {
  const navigate = useNavigate();
  const [showBuyConfirmation, setShowBuyConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailMessage,setShowFailMessage] = useState(false);

  const handleChatClick = (e) => {
    const automaticMessage = `Hi, I'm interested in this ${description}, http://localhost:3001/item/${id}`
    e.stopPropagation();
    navigate("../ChatPage", { state: { username: username, friendUsername: sellerUsername, automaticMessage }});
  };

  async function handleBuyClick(){
    setShowBuyConfirmation(true);
  }

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
      <p className="seller">Seller: {seller}</p>
      <h2 className="description">{description}</h2>
      <p className="size">Size: {size}</p>
      <p className="collection-point">Location: {collectionPoint}</p>
      <p className="condition">Condition: {condition}</p>
      <p className="color">Color: {color}</p>
      <p className="brand">Brand: {brand}</p>
      <p className="price">Price: {price}</p>
      {username != sellerUsername && !showSuccessMessage && !showFailMessage &&
      <>
       <button className="contact-seller-btn" onClick={handleChatClick}>Contact the seller</button>
      <button className="contact-seller-btn" onClick={handleBuyClick}>Buy</button>
      </>
      }
      {showBuyConfirmation && (
        <BuyConfirmationModal
          onConfirmBuy={handleConfirmBuy}
          onCancelBuy={handleCancelBuy}
        />
      )}
       {showSuccessMessage && (
        <div className="success-message success">
          The item was bought successfully!
        </div>
      )}
      {showFailMessage &&(
        <div className="success-message fail">
          You don't have enough credit. 
        </div>
      )}
    </div>
  );
};

export default DetailsOfProduct;
