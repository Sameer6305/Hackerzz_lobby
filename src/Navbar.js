import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav class="navbar">
  <div class="navbar-left">
    <div class="navbar-logo">Hackerzz Lobby</div>
    <ul class="navbar-links">
  <li><a href="#">Home</a></li>
  <li><a href="#about">About</a></li>
  <li><a href="#features">Features</a></li>
  <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
  <div class="navbar-actions">
    <button class="btn btn-signin">Sign In</button>
    <button class="btn btn-register">Register</button>
  </div>
</nav>


  );
};

export default Navbar;
