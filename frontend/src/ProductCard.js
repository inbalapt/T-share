import React from 'react';


function ProductCard(props) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={props.imageSrc} alt={props.name} />
      </div>
      <div className="product-details">
        <h2 className="product-title">{props.name}</h2>
        <p className="product-price">{props.price}</p>
        <button className="favorite" onClick={props.onFavoriteClick}>
          <i className="far fa-heart"></i> Save to Favorites
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
