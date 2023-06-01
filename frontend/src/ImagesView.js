import React, { useEffect, useState } from 'react';
import './ImagesView.css';
import { FaSearch } from 'react-icons/fa';
import { useRef } from 'react';

const ImagesView = ({ images }) => {
  console.log(images);
  const [mainImage, setMainImage] = useState(images[0]);
  const [zoom, setZoom] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [focusPosition, setFocusPosition] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef(null);

  useEffect(() => {
    setMainImage(images[0]);
  }, [images]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
    setFocusPosition({ x: 0, y: 0 });
    setZoom(false);
  };

  const toggleZoom = () => {
    setZoom(!zoom);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <div className="images-view">
      <div className="thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={`https://drive.google.com/uc?export=view&id=${image}`}
            alt={`Thumbnail ${index}`}
            onClick={() => handleThumbnailClick(image)}
            className={image === mainImage ? 'selected' : ''}
          />
        ))}
      </div>
      <div
        className={`main-image${zoom ? ' zoomed' : ''}${fullScreen ? ' full-screen' : ''}`}
        onMouseEnter={toggleZoom}
        onMouseLeave={toggleZoom}
        onMouseMove={(e) => {
          const rect = mainImageRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          mainImageRef.current.style.backgroundPosition = `${x}% ${y}%`;
        }}
        onClick={toggleFullScreen}
        style={{ backgroundImage: `url(https://drive.google.com/uc?export=view&id=${mainImage})` }}
        ref={mainImageRef}
      >
        <button className="zoom-in-btn" onClick={toggleZoom}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default ImagesView;
