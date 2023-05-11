// src/components/NavigationBar.js

import React from 'react';
import './NavigationBar.css';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <header>
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">Logo</Link>
        <div className="navbar-nav">
        <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <NavDropdown title="Products" id="basic-nav-dropdown">
                <NavDropdown.Item href="/clothing/all">View all</NavDropdown.Item>
                <NavDropdown.Item href="/clothing/dresses">Dresses</NavDropdown.Item>
                <NavDropdown.Item href="/clothing/tops">Tops</NavDropdown.Item>
                <NavDropdown.Item href="/clothing/skirts">Skirts</NavDropdown.Item>
                <NavDropdown.Item href="/clothing/pants">Pants</NavDropdown.Item>
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
          <a href="/favorites" className="nav-link">
            <i className="bi bi-heart fa-lg"></i>
            <i className="bi bi-heart-fill"></i>
          </a>
          <a href="/account/balance" className="nav-link">
            <i class="bi bi-coin"></i>
          </a>
          <a href="/ChatPage" className="nav-link">
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