import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';

const BRANCHES = [
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Aerospace Engineering',
  'Artificial Intelligence & Machine Learning',
  'Data Science',
  'Other',
];

const YEARS = [
  'First Year',
  'Second Year',
  'Third Year',
  'Final Year',
  'Graduated',
];

const SKILLS = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot',
  'Machine Learning', 'Data Science', 'AI', 'Deep Learning',
  'Web Development', 'Mobile Development', 'Cloud Computing', 'DevOps',
  'Blockchain', 'Cybersecurity', 'UI/UX Design', 'Game Development',
];

const INTERESTS = [
  'Web Development', 'Mobile Apps', 'AI/ML', 'Blockchain', 'IoT',
  'Cybersecurity', 'Cloud Computing', 'Data Science', 'Game Development',
  'AR/VR', 'Robotics', 'DevOps', 'UI/UX Design', 'Open Source',
];

export default function EditProfile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    college: '',
    branch: '',
    year: '',
    passingYear: '',
    city: '',
    country: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [],
    interests: [],
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

  function handleSkillToggle(skill) {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  }

  function handleInterestToggle(interest) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
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
            {/* Personal Information Section */}
            <h3 className="edit-profile-section-title">Personal Information</h3>
            <div className="edit-profile-form-grid">
              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="Enter your full name"
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="your.email@example.com"
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Date of Birth <span className="required-star">*</span>
                </label>
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  value={form.dateOfBirth} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Gender
                </label>
                <select 
                  name="gender" 
                  value={form.gender} 
                  onChange={handleChange}
                  className="edit-profile-input edit-profile-select"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  City <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="city" 
                  value={form.city} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="Enter your city"
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Country <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="country" 
                  value={form.country} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="Enter your country"
                  required 
                />
              </div>

              <div className="edit-profile-form-group edit-profile-form-group-full">
                <label className="edit-profile-label">
                  Bio / About Me
                </label>
                <textarea 
                  name="bio" 
                  value={form.bio} 
                  onChange={handleChange}
                  className="edit-profile-input edit-profile-textarea" 
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                  rows="4"
                />
              </div>
            </div>

            {/* Education Section */}
            <h3 className="edit-profile-section-title">Education</h3>
            <div className="edit-profile-form-grid">
              <div className="edit-profile-form-group edit-profile-form-group-full">
                <label className="edit-profile-label">
                  College/University <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="college" 
                  value={form.college} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="Enter your college or university name"
                  required 
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Branch/Major <span className="required-star">*</span>
                </label>
                <select 
                  name="branch" 
                  value={form.branch} 
                  onChange={handleChange}
                  className="edit-profile-input edit-profile-select" 
                  required
                >
                  <option value="">Select your branch</option>
                  {BRANCHES.map((branch, index) => (
                    <option key={index} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Current Year <span className="required-star">*</span>
                </label>
                <select 
                  name="year" 
                  value={form.year} 
                  onChange={handleChange}
                  className="edit-profile-input edit-profile-select" 
                  required
                >
                  <option value="">Select your year</option>
                  {YEARS.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  Expected Passing Year <span className="required-star">*</span>
                </label>
                <input 
                  type="number" 
                  name="passingYear" 
                  value={form.passingYear} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="e.g., 2026"
                  min="2024"
                  max="2030"
                  required 
                />
              </div>
            </div>

            {/* Social Links Section */}
            <h3 className="edit-profile-section-title">Social Links</h3>
            <div className="edit-profile-form-grid">
              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub Profile
                </label>
                <input 
                  type="url" 
                  name="githubUrl" 
                  value={form.githubUrl} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div className="edit-profile-form-group">
                <label className="edit-profile-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077B5" style={{ marginRight: '6px' }}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn Profile
                </label>
                <input 
                  type="url" 
                  name="linkedinUrl" 
                  value={form.linkedinUrl} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>

              <div className="edit-profile-form-group edit-profile-form-group-full">
                <label className="edit-profile-label">
                  🌐 Portfolio Website
                </label>
                <input 
                  type="url" 
                  name="portfolioUrl" 
                  value={form.portfolioUrl} 
                  onChange={handleChange}
                  className="edit-profile-input" 
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            {/* Skills Section */}
            <h3 className="edit-profile-section-title">Skills & Technologies</h3>
            <p className="edit-profile-section-desc">Select all skills you're proficient in (select multiple)</p>
            <div className="edit-profile-skills-grid">
              {SKILLS.map((skill, index) => (
                <button
                  key={index}
                  type="button"
                  className={`skill-tag ${form.skills.includes(skill) ? 'skill-tag-selected' : ''}`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Interests Section */}
            <h3 className="edit-profile-section-title">Hackathon Interests</h3>
            <p className="edit-profile-section-desc">Select domains you're interested in (select multiple)</p>
            <div className="edit-profile-skills-grid">
              {INTERESTS.map((interest, index) => (
                <button
                  key={index}
                  type="button"
                  className={`skill-tag ${form.interests.includes(interest) ? 'skill-tag-selected' : ''}`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </button>
              ))}
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
