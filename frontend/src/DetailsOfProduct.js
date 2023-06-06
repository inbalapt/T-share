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

const DetailsOfProduct = ({ username, seller, description, price, size, collectionPoint, condition, color, brand, sellerUsername, pictures, id, setUpdate, setPictures }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const [showBuyConfirmation, setShowBuyConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailMessage,setShowFailMessage] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const sizes = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const [itemDetails, setItemDetails] = useState({
    price:price,
    description:description,
    condition:condition,
    brand:brand,
    size:size,
    id:id,
    images: [],
  });
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

  const handleSellerName = async (e)=>{
    navigate(`/userPage/${sellerUsername}`, { state: { username: username} });
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

  /////////////////////////////////////////
  const handleInputChange = (event) => {
    setItemDetails({
        ...itemDetails,
        [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = async (event) => {  // <-- add this
    // if there is more than 4 images to the product
    if (event.target.files.length > 4) {
        alert("You can only upload up to 4 images.");
        event.target.value = null;  
       
    } else {
        setItemDetails({
            ...itemDetails,
            images: event.target.files,
        });
    }
};

  const handleSubmit = (event) => {
      event.preventDefault();
      // TODO: Add logic to send the updated data to the server
      
      const uploadChangesToServer = async () => {
          try {
              const formData = new FormData();
              formData.append('username', username);
              if(itemDetails.description !== null){
                  formData.append('description', itemDetails.description);
              } 
              if(itemDetails.price !== null){
                  formData.append('price', itemDetails.price);
              }
              if(itemDetails.brand !== null){
                  formData.append('brand', itemDetails.brand);
              }
              if(itemDetails.condition !== null){
                  formData.append('condition', itemDetails.condition);
              }
              if(itemDetails.size !== null){
                formData.append('size', itemDetails.size);
            }
            
            for (let i = 0; i < itemDetails.images.length; i++) {
              formData.append('images', itemDetails.images[i]);
          }
              formData.append('id', itemDetails.id);
              
              const response = await axios.post(`http://localhost:3000/updateItemDetails`, formData, {
                  headers: {
                      "Content-Type": "multipart/form-data",
                  },
              });

      
            console.log(response.data);
            if(response.data){
              setPictures(response.data.pictures);
            }
          } catch (error) {
              console.log('Error updating item:', error);
              // Handle error case, e.g., show an error message to the user
          }
      
      }
      uploadChangesToServer();
      setEditMode(false);
      
      //setUpdate(true);
  };


  if (editMode) {
    return (
        <form onSubmit={handleSubmit} className="my-item-form details-of-product">
            <h1 className="my-item-title">Item Details</h1>
            <label className="my-details-label">
            <div className='field-row-label'>
                Description:  
                </div>
                <input type="text" name="description" value={itemDetails.description} onChange={handleInputChange} className="upload-item-input"/>
            </label>
            <label className="my-details-label">
            <div className='field-row-label'>
                Price:  
                </div>
                <input type="number" name="price" value={itemDetails.price} onChange={handleInputChange} className="upload-item-input"/>
            </label>
            <label className="my-details-label">
            <div className='field-row-label'>
                Condition:  
                </div>
                <input type="text" name="condition" value={itemDetails.condition} onChange={handleInputChange} className="upload-item-input"/>
            </label>
            <label className="my-details-label">
            <div className='field-row-label'>
                Brand: 
                </div>
                <input type="brand" name="brand" value={itemDetails.brand} onChange={handleInputChange} className="upload-item-input"/>
            </label>
            <label className="my-details-label">
              <div className='field-row-label'>
              Size:  
              </div>
              <select name="size" onChange={handleInputChange} className="upload-item-input">
                  {sizes.map(size => <option value={size} key={size}>{size}</option>)}
              </select>
            </label>
            <label className="my-details-label">
              <div className='field-row-label'>
                  Product Images: 
                  <span className={itemDetails.images.length === 0 ? "dot-visible" : "dot-hidden"}></span>
                  </div>
                  <input type="file" name="image" multiple onChange={handleImageChange} className="upload-item-input"/>
                
            </label>
        
            <button type="submit" className="my-details-button">Save Changes</button>
        </form>
    );
  }

  return (
    <div className="details-of-product">
      {brand && (<p className="brand">{itemDetails.brand}</p>)}
      <h2 className="description">{itemDetails.description}</h2>
      <p className="price-details">Price: {itemDetails.price}</p>
      <p className="size">Size: {itemDetails.size}</p>
      <p className="condition">Condition: {itemDetails.condition}</p>
      {color && (<p className="color">Color: {itemDetails.color}</p>)}
      
      
      <p className="seller" onClick={handleSellerName}>Seller: {seller}</p>
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
      {username === sellerUsername && !showSuccessMessage && !showFailMessage &&
      <button className="contact-seller-btn" onClick={() => setEditMode(true)}>Edit</button>
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
