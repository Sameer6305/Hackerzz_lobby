import React, { useState } from 'react';
import './App.css';

const BRANCHES = [
  'CS',
  'IT',
  'Electrical',
  'Mechanical',
  'Civil',
  'Electronics',
  'Chemical',
  'Other',
];

export default function Profile({ user = {} }) {
  // In a real app, user data would come from context or API
  const [form, setForm] = useState({
    name: user.name || 'Alex Turner',
    email: user.email || 'alex@email.com',
    mobile: user.mobile || '',
    age: user.age || '',
    state: user.state || '',
    city: user.city || '',
    year: user.year || '',
    birthdate: user.birthdate || '',
    branch: user.branch || '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Save logic here
    localStorage.setItem('profileName', form.name);
    alert('Profile updated!');
  }

  return (
    <div className="profile-page">
      <h2 className="profile-title">Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-form-row">
          <label>Name</label>
          <input type="text" name="name" value={form.name} disabled />
        </div>
        <div className="profile-form-row">
          <label>Email</label>
          <input type="email" name="email" value={form.email} disabled />
        </div>
        <div className="profile-form-row">
          <label>Mobile Number</label>
          <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} required />
        </div>
        <div className="profile-form-row">
          <label>Age</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} min="10" max="100" required />
        </div>
        <div className="profile-form-row">
          <label>State</label>
          <input type="text" name="state" value={form.state} onChange={handleChange} required />
        </div>
        <div className="profile-form-row">
          <label>City</label>
          <input type="text" name="city" value={form.city} onChange={handleChange} required />
        </div>
        <div className="profile-form-row">
          <label>Year</label>
          <input type="text" name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2nd, 3rd, Final" required />
        </div>
        <div className="profile-form-row">
          <label>Birth Date</label>
          <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} required />
        </div>
        <div className="profile-form-row">
          <label>Branch</label>
          <select name="branch" value={form.branch} onChange={handleChange} required>
            <option value="" disabled>Select branch</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <button className="profile-save-btn" type="submit">Save Changes</button>
      </form>
    </div>
  );
}
