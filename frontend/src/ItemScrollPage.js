// src/components/ItemScrollPage.js

import React from 'react';
import './ItemScrollPage.css';
import NavigationBar from './NavigationBar';
import ItemCard from './ItemCard';
import logo from './logo.jpg'
import { useParams ,useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

let itemsTemp =  [{id:"1", photo:logo, seller:"John Doe", price:"100", description:"A beautiful dress"},
{id:"2", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"3", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"4", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"5", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"6", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"7", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"8", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"9", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"10", photo:logo, seller:"John Doe", price:"100", description:"A beautiful dress"},
{id:"11", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"12", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"13", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"14", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"15", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"16", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"17", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"18", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"19", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},

{id:"20", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"21", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"22", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"23", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"24", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"25", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"26", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"27", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"28", photo:logo, seller:"John Doe", price:"100", description:"A beautiful dress"},
{id:"29", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"30", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"31", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"32", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"33", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"34", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"35", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"36", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"37", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"38", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"39", photo:logo, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"40", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"},
{id:"41", photo:logo, seller:"John Doe", price:"10", description:"A beautiful dress"},
{id:"42", photo:logo, seller:"John Doe", price:"30", description:"A beautiful dress"},
{id:"43", photo:logo, seller:"John Doe", price:"70", description:"A beautiful dress"}]


function getCategoryHeadline(category) {
    var content;
    // define the top category
    if (category === 'dresses') {
        content = <div>Dresses</div>
    } else if (category === 'tops') {
        content = <div>Tops</div>
    } else if (category === 'all') {
        content = <div>All items</div>
    } else if (category === 'skirts') {
        content = <div>Skirts</div>
    } else if (category === 'pants') {
        content = <div>Pants</div>
    } else {
        content = <div>Invalid category</div>;
    }
    return content;

}

const getCategoryItems = async (category,username, setItems) => {
  try {
    const response = await axios.get(`http://localhost:3000/items/${category}?username=${username}`);
    console.log(response.data);
    setItems(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


const ItemScrollPage = ({ filterOptions, handleFilter }) => {
    // the category of the page (like dresses, tops etc..)
    const { category } = useParams();
    // The type of how we sort our products.
    const [sortType, setSortType] = useState("relevent");
    const [items, setItems] = useState([]);
    const location = useLocation();
    const username = location.state.username;
    

    
    useEffect(() => {
        // Fetch items from your API or use the existing items array
        const fetchItems= getCategoryItems(category,username, setItems);
    }, [category]);

    
    

    //const location = useLocation();
    //const items = location.state?.items || [];
    let content = getCategoryHeadline(category);
    let img =  `/pictures/${category}.jpg`;

    const handleSortChange = (e) => {
        setSortType(e.target.value);
      };


    // if the sort type (relevent, price: low to high etc..) had change - change the order
    // of the items according to that.
      useEffect(() => {
        const sortedItems = [...items];
        switch (sortType) {
          case 'popularity':
            // Sort by popularity logic
            break;
          case 'priceLowToHigh':
            sortedItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
          case 'priceHighToLow':
            sortedItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
          default:
            // Default is to sort by relevance
            break;
        }
    
        setItems(sortedItems);
      }, [sortType]);

  return (
    <div>
      <NavigationBar />
      <div className="category-header" style={{ backgroundImage:`url(${img})`}}>
        <h1>{content}</h1>
      </div>
      <div className="filter-bar">
        <select value={sortType} onChange={handleSortChange}>
          <option value="relevent">Relevance</option>
          <option value="popularity">Most Popular</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
        </select>
      </div>
      
      <div className="item-grid">
        {items.map((item) => (
          <ItemCard key={item.id} {...item} username={username} />
        ))}
      </div> 

    </div>
    
  );
};

export default ItemScrollPage;