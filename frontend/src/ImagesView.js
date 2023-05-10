// src/components/ImagesView.js
import React, { useState } from 'react';
import './ImagesView.css';
import { FaSearch } from 'react-icons/fa';

const ImagesView = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const [zoom, setZoom] = useState(false);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const toggleZoom = () => {
    setZoom(!zoom);
  };

  return (
    <div className="images-view">
      <div className="thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => handleThumbnailClick(image)}
            className={image === mainImage ? 'selected' : ''}
          />
        ))}
      </div>
      <div className={`main-image${zoom ? ' zoomed' : ''}`}>
        <img src={mainImage} alt="Main Product" />
        <button className="zoom-in-btn" onClick={toggleZoom}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default ImagesView;
