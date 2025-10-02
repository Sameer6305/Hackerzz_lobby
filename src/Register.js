import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => (
  <div className="auth-page">
    <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 700, marginBottom: 18, fontSize: '1.4rem' }}>&larr; Home</Link>
    <h2>Register</h2>
    <form className="auth-form">
      <input type="text" placeholder="Name" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
);

export default Register;
