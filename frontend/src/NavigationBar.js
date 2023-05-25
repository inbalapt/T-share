// src/components/NavigationBar.js

import React, { useEffect, useState } from 'react';
import './NavigationBar.css';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { useNavigate,  useLocation } from "react-router-dom";
import axios from 'axios';

// Get credit of user
const getCredit = async (username,setCredit) => {
    try {
      const response = await axios.get(`http://localhost:3000/getCredit?username=${username}`);
      setCredit(response.data.credit);
      console.log(response.data.credit);
      return response.data.credit;
    } catch (error) {
      console.error(error);
    }
  };


const NavigationBar = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username;
  console.log(username);
  const [credit,setCredit] = useState(0);

  useEffect(()=>{
    getCredit(username,setCredit);
  }, []);

  function handleChat(){
    navigate("../ChatPage", { state: {username: username }});
  }
  

  function handleCategory(category){
    navigate(`../clothing/${category}`, {state: {username: username}})
  }

  function handleHome(){
    navigate("../HomePage", { state: {username: username }});
  }

  function handleAccount(){
    navigate("../account", { state: {username: username }});
  }

  function handleFavorites(){
    navigate("../favorites", { state: {username: username }});
  }
  
  return (
    <header>
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">Logo</Link>
        <div className="navbar-nav">
        <Nav className="me-auto">
              <Nav.Link onClick={handleHome}>Home</Nav.Link>
              <NavDropdown title="Products" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={()=>handleCategory('all')}>View all</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>handleCategory('dresses')}>Dresses</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>handleCategory('tops')}>Tops</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>handleCategory('skirts')}>Skirts</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>handleCategory('pants')}>Pants</NavDropdown.Item>
              </NavDropdown>
            </Nav>
        </div>
        <form className="d-flex search-bar">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn search-button" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
        <div className="d-flex icons">
          <a href="/favorites" className="nav-link" onClick={handleFavorites}>
            <i className="bi bi-heart fa-lg"></i>
            <i className="bi bi-heart-fill"></i>
          </a>
          <a href="/account/balance" className="nav-link">
            <i class="bi bi-coin" title={`Credit: ${credit}`}></i>
          </a>
          <a href="/ChatPage" className="nav-link" onClick={handleChat}>
            <i className="bi bi-chat-dots"></i>
            <i className="bi bi-chat-dots-fill"></i>
          </a>
          <a href="/account" className="nav-link" onClick={handleAccount}>
            <i className="bi bi-person"></i>
            <i className="bi bi-person-fill"></i>
          </a>
        </div>
      </div>
    </nav>
    </header>
  );
};

export default NavigationBar;