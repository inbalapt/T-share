// src/components/NavigationBar.js

import React, { useEffect, useState } from 'react';
import './NavigationBar.css';
import { Link } from 'react-router-dom';
import logo from './logo.jpeg'
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate,  useLocation } from "react-router-dom";
import axios from 'axios';
import defaultProfile from './chating/defaultProfile.png';

// Get credit of user
const getCredit = async (username,setCredit) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/getCredit?username=${username}`);
      setCredit(response.data.credit);
      console.log(response.data.credit);
      return response.data.credit;
    } catch (error) {
      console.error(error);
    }
  };

  const AutocompleteResult = ({ result, username, setSearchTerm, setAutocompleteResults, searchField, profile }) => {
    const navigate = useNavigate();
    console.log(result);
    const navigateToItem = (e) => {
      if(e.target.closest('.seller')){
        e.stopPropagation();
        return;
      }
      setSearchTerm("");
      setAutocompleteResults([]);
      navigate(`/item/${result._id}`, { state: { username: username } });
    };
    function handleUser(){
      setSearchTerm("");
      setAutocompleteResults([]);
      navigate(`/userPage/${result.sellerUsername}`, { state: { username: username} });      
    }
    
    return (
      <div className="autocomplete-result"  onClick={navigateToItem}>
        <div className="image-container">
          <img src={`https://drive.google.com/uc?export=view&id=${result.pictures[0]}`} alt="Item" className="item-image" />
        </div>
        <div className="details-container">
        <div className="description">{result.description}</div>
       <div className="seller" onClick={handleUser}>{result.sellerFullName}</div>
        </div>
      </div>
    );
  };


const NavigationBar = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username;
  console.log(username);
  const [credit,setCredit] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [searchField,setSearchField] = useState("");
  const [profile, setProfile] = useState("");

  useEffect(()=>{
    getCredit(username,setCredit);
    const checkUnreadMessages = async ()=>{
      try{
        const response = await axios.get(`http://localhost:3000/hasUnreadMessages?username=${username}`)
        setHasUnreadMessages(response.data.has);
        console.log(response.data.has);
      } catch (error) {
        console.error(error);
      }};
    checkUnreadMessages();
  }, [credit]);


  async function handleChat(){
    setHasUnreadMessages(false);
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

  function handleItem(_id){
    setSearchTerm("");
    setAutocompleteResults([]);
    navigate(`/item/${_id}`, { state: { username: username} });
    
  }

  function handleFeed(){
    navigate(`/userPage/${username}`, { state: { username: username} });      
  }

  

  useEffect(() => {
    const fetchAutocompleteResults = async () => {
      try {
        if (searchTerm.length > 2) {
          const response = await axios.get(`http://localhost:3000/item/autocomplete`, {
            params: {
              term: searchTerm,
              username: username,
            },
          });
          setAutocompleteResults(response.data.results);
          setSearchField(response.data.searchField);
          console.log(response.data.profile);
          setProfile(response.data.profile);
        } else {
          setAutocompleteResults([]); // Clear the autocomplete results if the search term is less than two characters
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAutocompleteResults(); // Call the API initially

  }, [searchTerm]);

  useEffect(() => {
    const handleSearchTermChange = () => {
      if (searchTerm.length <= 2 || searchTerm.length === 0) {
        setAutocompleteResults([]); // Clear the autocomplete results if the search term is less than two characters
      }
    
    };

    handleSearchTermChange(); // Handle the search term change initially

  }, [searchTerm]);

  /*function handleSearchSubmit(e) {
    e.preventDefault(); 
    // Navigate to first result page
    handleItem(autocompleteResults[0]._id);
    // You can access the current value of the search term using the `searchTerm` state variable
    console.log(searchTerm);
    setSearchTerm(""); // Clear the search term after submission if needed
  }*/
  
  
  return (
    <header>
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-brand"><img className='logo-img' src={logo} alt="Logo" onClick={handleHome} /></div>
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
        <form className="d-flex search-bar" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && autocompleteResults.length > 0 && (
            <ul className="autocomplete-results">
              {autocompleteResults.map((result) => (
                <li key={result._id}>
                  <AutocompleteResult result={result} username={username} setSearchTerm={setSearchTerm} setAutocompleteResults={setAutocompleteResults} searchField={searchField} profile={profile}/>
                </li>
              ))}
            </ul>
          )}

          <button className="btn search-button">
            <i className="bi bi-search"></i>
          </button>
        </form>
        
        <div className="d-flex icons">
           <NavDropdown id="basic-nav-dropdown" title={
            <>
                <i className="bi bi-person"></i>
                <i className="bi bi-person-fill"></i>
                </>
            } className="no-arrow-dropdown" align="end">
              <NavDropdown.Item  onClick={handleFeed}>
                My Feed
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleAccount}>
                Settings
              </NavDropdown.Item>
            </NavDropdown>
          <a href="/favorites" className="nav-link" onClick={handleFavorites}>
            <i className="bi bi-heart fa-lg"></i>
            <i className="bi bi-heart-fill"></i>
          </a>
          <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="credit-tooltip">Your credit is: {credit}</Tooltip>}
            >
              <a className="nav-link">
                <i className="bi bi-coin"></i>
              </a>
            </OverlayTrigger>
          
          <a href="/ChatPage" className="nav-link" onClick={handleChat}>
            <i className="bi bi-chat-dots"></i>
            <i className="bi bi-chat-dots-fill"></i>
            {hasUnreadMessages && (
              <span className="green-point"></span>
            )}
          </a>
          {false && (<a href="/account" className="nav-link" onClick={handleAccount}>
            <i className="bi bi-person"></i>
            <i className="bi bi-person-fill"></i>
          </a>)}
        
         

        </div>
      </div>
    
    </nav>
    
    </header>
  );
};

export default NavigationBar;