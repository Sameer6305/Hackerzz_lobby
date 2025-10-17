import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from './utils/authUtils';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    phone: ''
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Register user
    const result = await registerUser(formData);
    
    setLoading(false);

    if (result.success) {
      alert('Registration successful! Please sign in with your credentials.');
      navigate('/signin');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 700, marginBottom: 18, fontSize: '1.4rem' }}>&larr; Home</Link>
      <h2>Create Your Account</h2>
      <p style={{ color: '#666', marginBottom: 20, fontSize: '0.95rem' }}>
        Join Hackerzz Lobby and start collaborating!
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
          type="text" 
          name="name"
          placeholder="Full Name *" 
          value={formData.name}
          onChange={handleChange}
          required 
        />
        <input 
          type="email" 
          name="email"
          placeholder="Email Address *" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
        <input 
          type="text" 
          name="college"
          placeholder="College/University (Optional)" 
          value={formData.college}
          onChange={handleChange}
        />
        <input 
          type="tel" 
          name="phone"
          placeholder="Phone Number (Optional)" 
          value={formData.phone}
          onChange={handleChange}
        />
        <input 
          type="password" 
          name="password"
          placeholder="Password (Min 6 characters) *" 
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          required 
        />
        <input 
          type="password" 
          name="confirmPassword"
          placeholder="Confirm Password *" 
          value={formData.confirmPassword}
          onChange={handleChange}
          minLength={6}
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p style={{ marginTop: 20, textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/signin" style={{ color: '#4F46E5', fontWeight: 600 }}>Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
