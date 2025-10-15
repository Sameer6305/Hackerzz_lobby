import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';

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

export default function EditProfile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: 'Alex Turner',
    email: 'alex.turner@email.com',
    mobile: '+1 234 567 8900',
    age: '22',
    state: 'California',
    city: 'San Francisco',
    year: 'Final Year',
    birthdate: '2002-05-15',
    branch: 'CS',
  });

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('profileData', JSON.stringify(form));
    alert('Profile updated successfully!');
    navigate('/profile');
  }

  return (
    <div className={"dashboard-root" + (sidebarOpen ? "" : " sidebar-collapsed")}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <img src={logoImg} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Alex Turner</div>
            <div className="sidebar-user-role">Student</div>
            <div className="sidebar-user-status">Active</div>
          </div>
          {sidebarOpen && (
            <button className="sidebar-toggle sidebar-toggle--sidebar" onClick={() => setSidebarOpen(false)} aria-label="Collapse sidebar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate('/dashboard')}>Dashboard</li>
            <li onClick={() => navigate('/recent-hackathons')}>Recent Hackathons</li>
            <li onClick={() => navigate('/communities')}>Communities</li>
            <li onClick={() => navigate('/notifications')}>Notifications</li>
            <li onClick={() => navigate('/deadlines')}>Deadlines</li>
            <li onClick={() => navigate('/activity')}>Activity</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        {/* Top App Bar */}
        <header className="dashboard-appbar">
          <div className="appbar-left">
            {!sidebarOpen && (
              <button className="appbar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
          <input className="appbar-search" placeholder="Search" />
          <div className="appbar-user" ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="appbar-bell" style={{ color: '#181c23', fontSize: '1.3rem', margin: '0 6px 0 0' }}>🔔</span>
            <div className="appbar-user-info">
              <div className="appbar-user-name">Alex Turner</div>
            </div>
            <div
              className="appbar-user-avatar"
              style={{ background: '#e0e0e0', color: '#232733', fontWeight: 700, fontSize: '1.1rem', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setMenuOpen((open) => !open)}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              AT
            </div>
            {menuOpen && (
              <div className="appbar-user-dropdown">
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>Profile</button>
                <button className="appbar-user-dropdown-item">Settings</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout">Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Edit Profile Form */}
        <div className="edit-profile-container">
          <div className="edit-profile-header">
            <button className="edit-profile-back-btn" onClick={() => navigate('/profile')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Profile
            </button>
            <h2 className="edit-profile-title">Edit Profile</h2>
          </div>

          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="edit-profile-form-grid">
              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={form.mobile} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={form.age} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  min="10" 
                  max="100" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">State</label>
                <input 
                  type="text" 
                  name="state" 
                  value={form.state} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={form.city} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Academic Year</label>
                <input 
                  type="text" 
                  name="year" 
                  value={form.year} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="e.g. 2nd, 3rd, Final" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">Birth Date</label>
                <input 
                  type="date" 
                  name="birthdate" 
                  value={form.birthdate} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group edit-profile-form-group-full">
                <label className="edit-profile-label">Branch</label>
                <select 
                  name="branch" 
                  value={form.branch} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  required
                >
                  <option value="" disabled>Select branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="edit-profile-form-actions">
              <button 
                type="button" 
                className="edit-profile-cancel-btn" 
                onClick={() => navigate('/profile')}
              >
                Cancel
              </button>
              <button type="submit" className="edit-profile-save-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
