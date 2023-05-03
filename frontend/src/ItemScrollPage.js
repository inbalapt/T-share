// src/components/ItemScrollPage.js

import React from 'react';
import './ItemScrollPage.css';
import NavigationBar from './NavigationBar';
import Item from './Item';

const ItemScrollPage = ({ category, items, filterOptions, handleFilter }) => {
  return (
    <div>
      <NavigationBar />
      <div className="category-header" style={{ backgroundImage: `url(${category.image})` }}>
        <h1>{category.name}</h1>
      </div>
      <div className="filter-bar">
        <select onChange={(e) => handleFilter(e.target.value)}>
          {filterOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="item-grid">
        {items.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ItemScrollPage;
