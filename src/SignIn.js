import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInUser } from './utils/authUtils';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Sign in user
    const result = await signInUser(formData.email, formData.password);
    
    setLoading(false);

    if (result.success) {
      // Navigate to dashboard on successful sign in
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 700, marginBottom: 18, fontSize: '1.4rem' }}>&larr; Home</Link>
      <h2>Welcome Back!</h2>
      <p style={{ color: '#666', marginBottom: 20, fontSize: '0.95rem' }}>
        Sign in to continue to your account
      </p>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '12px', 
          borderRadius: '6px', 
          marginBottom: '16px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email"
          placeholder="Email Address" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
        <input 
          type="password" 
          name="password"
          placeholder="Password" 
          value={formData.password}
          onChange={handleChange}
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <p style={{ marginTop: 20, textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#4F46E5', fontWeight: 600 }}>Register Now</Link>
      </p>
    </div>
  );
};

export default SignIn;
