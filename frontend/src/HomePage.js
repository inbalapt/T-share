import React from 'react';
import './ItemScrollPage.css';
import NavigationBar from './NavigationBar';
//import Item from './Item';
//import logo from './logo.jpg'
//import { useParams ,useLocation} from 'react-router-dom';
//import { useState, useEffect } from 'react';


const HomePage = () => {

    //let img = `/pictures/home.jpg`;

    return (
        <div>
          <NavigationBar />
          <div className="category-header" style={{ backgroundImage:`url(${`/pictures/home.jpg`})`}}>
            <h1>Wellcome</h1>
            </div>
        </div>
    )
};

export default HomePage;