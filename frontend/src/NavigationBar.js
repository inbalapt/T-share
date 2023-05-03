// src/components/NavigationBar.js

import React from 'react';
import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <header>
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Logo</a>
        <div className="navbar-nav">
          <a className="nav-link" href="/">Home</a>
          <div className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Products
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a className="dropdown-item" href="/clothing/all">Everything</a>
              </li>
              <li>
                <a className="dropdown-item" href="/clothing/dresses">Dresses</a>
              </li>
              <li>
                <a className="dropdown-item" href="/clothing/shirts">Shirts</a>
              </li>
              <li>
                <a className="dropdown-item" href="/clothing/skirts">Skirts</a>
              </li>
              <li>
                <a className="dropdown-item" href="/clothing/general">General</a>
              </li>
            </ul>
          </div>
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
          <a href="/favorites" className="nav-link">
            <i className="bi bi-heart fa-lg"></i>
            <i className="bi bi-heart-fill"></i>
          </a>
          <a href="/account/balance" className="nav-link">
            <i class="bi bi-coin"></i>
          </a>
          <a href="/chat" className="nav-link">
            <i className="bi bi-chat-dots"></i>
            <i className="bi bi-chat-dots-fill"></i>
          </a>
          <a href="/account" className="nav-link">
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