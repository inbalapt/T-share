// src/components/ItemScrollPage.js

import React from 'react';
import './ItemScrollPage.css';
import NavigationBar from '../NavigationBar';
import ItemCard from './ItemCard';
import { useParams ,useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


function getCategoryHeadline(category) {
    var content;
    // define the top category
    if (category === 'dresses') {
        content = <div >Dresses</div>
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


const getCategoryItems = async (category, username, page, limit, sort ,setItems, setLoading) => {
  try {
    if(sort=="relevent"){
      setLoading(true);
    }
    
    const response = await axios.get(`http://localhost:3000/item/items/${category}`, {
      params: { page, limit,username, sort }
    });
    setItems(response.data.items);
    setLoading(false);
    return response.data.totalPages; // Return the total number of pages from the server
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
}



const ItemScrollPage = ({ filterOptions, handleFilter }) => {
    // the category of the page (like dresses, tops etc..)
    const { category } = useParams();
    // The type of how we sort our products.
    const [sortType, setSortType] = useState("popularity");
    const [items, setItems] = useState([]);
    const location = useLocation();
    const username = location.state.username;
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(28);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    

    
    useEffect(() => {
      const fetchItems = async () => {
        const totalPages = await getCategoryItems(category, username, currentPage, itemsPerPage, sortType, setItems, setLoading);
        // Optionally, you can store the total number of pages in a state variable if needed
        setTotalPages(totalPages);
      };
      fetchItems();
    }, [category, currentPage, itemsPerPage, username, sortType]);

    useEffect(() => {
      setCurrentPage(1);
    }, [sortType]);
    

    
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      }
    };
    
    const handleNextPage = () => {
      // Assuming you have the total number of pages stored in a state variable named 'totalPages'
      if (currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    };

    //const location = useLocation();
    //const items = location.state?.items || [];
    let content = getCategoryHeadline(category);
    let img =  `/pictures/${category}.jpg`;

    const handleSortChange = (e) => {
        setSortType(e.target.value);
      };

/*
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
*/

  return (
    <div>
      <NavigationBar />
     
      <div className="category-head-scroll" style={{ backgroundImage:`url(${img})`}}>
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
      {loading ? (
        <div className="loading-animation">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
      {totalPages > 1 && (<div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>)}
      <div className="item-grid">
        {items.map((item) => (
          <ItemCard key={item.id} {...item} username={username} />
        ))}
      </div> 
      {totalPages > 1 && (<div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>)}
      </>)}
    </div>
    
  );
};

export default ItemScrollPage;