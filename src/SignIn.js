import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful sign in
    navigate('/dashboard');
  };
  return (
    <div className="auth-page">
      <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 700, marginBottom: 18, fontSize: '1.4rem' }}>&larr; Home</Link>
      <h2>Sign In</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
