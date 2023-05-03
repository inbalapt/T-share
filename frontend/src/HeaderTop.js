import { useState } from 'react';
import './HeaderTop.css'
import logo from './logo.jpg'
//import { Link, BrowserRouter, Route, Routes } from 'react-router-dom'
 /*
    <header className='header-app'>
        <div className='header-top flex justify-content-between align-items-center'>

          <div class="navbar-logo" href="/">
            <img src="logo.jpg" />
          </div>

          <div className='search-bar flex border border-gray-500 rounded-full shadow-gray-300 py-2 px-4'>
            <div>
              dklmldfkmgkldfmg
            </div>


          </div>




        </div>


      </header>




    <>
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col order-first position-relative">
    
                    </div>
                    <div className="col">
                        
                            <h5 className="mb-1 name">{"x.displayName"}</h5>
                    </div>
                </div>
            </div>
        </>
    
        <>
          <header class="header">
            <nav class="navbar">
              <div className="navbar-brand">
                <a class="navbar-item" href="/">
                  <img src="logo.jpg" alt="My Store" />
                </a>
                <div class="navbar-burger burger" data-target="navMenu">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="navbar-menu" id="navMenu">
                <div class="navbar-start">
                  <a class="navbar-item" href="/men">Men</a>
                  <a class="navbar-item" href="/women">Women</a>
                  <a class="navbar-item" href="/kids">Kids</a>
                </div>
                <div class="navbar-end">
                  <div class="navbar-item">
                    <div class="buttons">
                      <a class="button is-light" href="/login">Log in</a>
                      <a class="button is-primary" href="/signup">
                        <strong>Sign up</strong>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </header>
        </>
        
        */

/* 
<>
  <header className='header-app'>
    <div className='header-top'>


      <div className='container d-flex align-items-center justify-content-between"'>
        <div>
          jof
        </div>


      </div>
    </div>

  </header>
</>


const Tab = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const onClickTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="tab">
      <div className="tab-list">
        {children.map((child, index) => (
          <button
            key={index}
            className={`tab-list-item ${activeTab === index ? 'active' : ''}`}
            onClick={() => onClickTab(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {children[activeTab]}
      </div>
    </div>
  );
};

const TabItem = ({ children }) => {
  return <div className="tab-content-item">{children}</div>;
};

const FrontTab = () => {
  return (
    <div>
      <Tab>
        <TabItem label="Category 1">
          <h2>Category 1 Content</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </TabItem>
        <TabItem label="Category 2">
          <h2>Category 2 Content</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </TabItem>
        <TabItem label="Category 3">
          <h2>Category 3 Content</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </TabItem>
      </Tab>
    </div>
  );
};

*/




function HeaderTop() {

  return (



    //<div className='container d-flex align-items-center justify-content-between"'>
    ///////////////////////////////////
    <>
      <header className='header-top flex justify-content-between align-items-center'>
        <img src="logo.jpg" alt="Company Logo" />


        <form className='search-bar flex border border-gray-500 rounded-full shadow-gray-300 py-2 px-4'>
          <input className='y' type="text" placeholder="Search..." />
          <button className='k pull-left' type="submit"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
          </button>
        </form>
        <nav className='header-top flex-column justify-content-between pull-left'>
          <ul className="navbar-nav flex-row">
            <li className='nav-item px-2'><a href="#">Home</a></li>
            <li className='nav-item px-2'><a href="#">Products</a></li>
            <li className='nav-item px-2'><a href="#">Contact Us</a></li>
          </ul>
        </nav>

        <ul className='navbar-nav flex-row flex-wrap ms-md-auto px-4'>
          <li className='item px-2'><a type="submit"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
          </svg>
          </a>
          </li>
          <li className='item px-2'>
            <a type="submit"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
            </svg>
            </a> </li>



        </ul>

      </header>
    </>


   
  );
}

export default HeaderTop;


