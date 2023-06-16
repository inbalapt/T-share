import React from 'react';
import NavigationBar from '../NavigationBar';
import { useNavigate, useLocation } from "react-router-dom";
import './HomePage.css';

const HomePage = () => {
    const location = useLocation();
    let navigate = useNavigate();
    const username = location.state.username;

    function handleCategory(category){
        navigate(`../clothing/${category}`, {state: {username: username}})
    }

    return (
        <div className="home-page">
            <NavigationBar username={username}/>
            <div className='parent-cat-head'> 
                <div className="category-header" style={{ backgroundImage:`url(${`/pictures/home.jpg`})`}}>
                    <h1 className='head-home'>Step into Sustainable Style: Welcome to T-Share</h1>
                </div>
            </div>

            <div className='home-categories'>
                <div 
                    className='category-dress' 
                    style={{ backgroundImage:`url(${`/pictures/dress-home.jpg`})`}}
                    onClick={() => handleCategory('dresses')}
                >
                    <div className="category-label">Buy Dresses</div>
                </div>

                <div 
                    className='category-top' 
                    style={{ backgroundImage:`url(${`/pictures/top-home.jpg`})`}}
                    onClick={() => handleCategory('tops')}
                >
                    <div className="category-label">Buy Tops</div>
                </div>

                <div className='skirt-pants'>
                    <div 
                        className='category-skirt' 
                        style={{ backgroundImage:`url(${`/pictures/skirt-home.jpg`})`}}
                        onClick={() => handleCategory('skirts')}
                    >
                        <div className="category-label">Buy Skirts</div>
                    </div>

                    <div 
                        className='category-pants' 
                        style={{ backgroundImage:`url(${`/pictures/pants-home.jpg`})`}}
                        onClick={() => handleCategory('pants')}
                    >
                        <div className="category-label">Buy Pants</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
