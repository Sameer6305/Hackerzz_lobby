import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">Hackerzz Lobby</div>
        <ul className="navbar-links">
          <li><a href="#">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <div className="navbar-auth">
        <Link to="/signin">
          <button className="btn btn-signin">Sign In</button>
        </Link>
        <Link to="/register">
          <button className="btn btn-register">Register</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
