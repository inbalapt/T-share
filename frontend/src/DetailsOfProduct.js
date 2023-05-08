// src/components/DetailsOfProduct.js
import React from 'react';
import './DetailsOfProduct.css';

const DetailsOfProduct = ({ seller, description, price, size, collectionPoint, condition, color, brand }) => {
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
      <button className="contact-seller-btn">Contact the seller</button>
    </div>
  );
};

export default DetailsOfProduct;
