import React from 'react';
import './ItemScrollPage.css';
import NavigationBar from './NavigationBar';
//import Item from './Item';
//import logo from './logo.jpg'
import { useParams ,useLocation} from 'react-router-dom';
//import { useState, useEffect } from 'react';


const HomePage = () => {
    const location = useLocation();
    const username = location.state.username;
    //let img = `/pictures/home.jpg`;

    return (
        <div>
          <NavigationBar username={username}/>
          <div className="category-header" style={{ backgroundImage:`url(${`/pictures/home.jpg`})`}}>
            <h1>Wellcome</h1>
            </div>
        </div>
    )
};

export default HomePage;