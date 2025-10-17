import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials } from './utils/profileUtils';
import { registerForHackathon, getUserHackathons } from './utils/userDataUtils';
import { signOutUser } from './utils/authUtils';

// Recent hackathon data with real events from 2024-2025
const hackathonsData = [
  {
    id: 1,
    name: 'Cosmohack1',
    logo: '🌌',
    community: 'Sourcify community',
    prize: '₹ 25',
    registered: 3,
    daysLeft: 26,
    status: 'Online',
    updatedOn: 'Oct 14, 2025',
    officialWebsite: 'https://cosmohack.dev',
    tags: ['Hackathon', 'Undergraduate'],
    isFree: true,
    registrationDeadline: '26 days left',
    teamSize: '1 - 4 Members',
    impressions: 149,
    description: 'Cosmohack1 is a space-themed hackathon focusing on innovative solutions for space exploration and satellite technology. Build projects that push the boundaries of aerospace engineering and astronomy.',
    eligibility: 'Open to undergraduate students worldwide',
    themes: ['Space Technology', 'Satellite Systems', 'Astronomy', 'Data Science']
  },
  {
    id: 2,
    name: 'AlgoSSTrike',
    logo: '⚡',
    community: 'Scaler School of Technology, Bengaluru, Karnataka',
    prize: '₹ 45,000',
    registered: 7,
    daysLeft: 27,
    status: 'Online',
    updatedOn: 'Oct 13, 2025',
    officialWebsite: 'https://algosstrike.dev',
    tags: ['Hackathon', 'Undergraduate', 'Postgraduate'],
    isFree: true,
    registrationDeadline: '27 days left',
    teamSize: '2 - 5 Members',
    impressions: 342,
    description: 'AlgoSSTrike is a competitive programming and algorithm-focused hackathon. Solve complex algorithmic challenges, build efficient solutions, and compete with the best minds in data structures and algorithms.',
    eligibility: 'Open to undergraduate and postgraduate students',
    themes: ['Algorithms', 'Data Structures', 'Competitive Programming', 'Problem Solving']
  },
  {
    id: 3,
    name: 'Code Against Clock',
    logo: '⏱️',
    community: 'Scaler School of Technology, Bengaluru, Karnataka',
    prize: '₹ 25,000',
    registered: 1,
    daysLeft: 30,
    status: 'Online',
    updatedOn: 'Oct 12, 2025',
    officialWebsite: 'https://codeagainstclock.dev',
    tags: ['Hackathon', 'Undergraduate', 'Postgraduate'],
    isFree: true,
    registrationDeadline: '1 month left',
    teamSize: '1 - 4 Members',
    impressions: 267,
    description: 'Code Against Clock is a time-bound coding competition where speed meets accuracy. Race against time to build functional prototypes, solve real-world problems, and showcase your rapid development skills.',
    eligibility: 'Open to all students',
    themes: ['Rapid Development', 'Full Stack', 'API Integration', 'DevOps']
  },
  {
    id: 4,
    name: 'MLH HackCon 2025',
    logo: '🎯',
    community: 'Major League Hacking',
    prize: '₹ 2,50,000',
    registered: 156,
    daysLeft: 45,
    status: 'Hybrid',
    updatedOn: 'Oct 10, 2025',
    officialWebsite: 'https://hackcon.mlh.io',
    tags: ['Hackathon', 'International', 'All Levels'],
    isFree: true,
    registrationDeadline: '45 days left',
    teamSize: '1 - 6 Members',
    impressions: 5420,
    description: 'MLH HackCon is one of the largest student hackathons globally. Join thousands of hackers worldwide to build innovative projects across various domains including AI, blockchain, IoT, and social impact.',
    eligibility: 'Open to all students worldwide',
    themes: ['Artificial Intelligence', 'Blockchain', 'IoT', 'Social Impact', 'Web3']
  },
  {
    id: 5,
    name: 'ETHIndia 2025',
    logo: '⛓️',
    community: 'DevFolio',
    prize: '₹ 15,00,000',
    registered: 892,
    daysLeft: 60,
    status: 'In-Person',
    updatedOn: 'Oct 8, 2025',
    officialWebsite: 'https://ethindia.co',
    tags: ['Hackathon', 'Blockchain', 'Web3'],
    isFree: true,
    registrationDeadline: '2 months left',
    teamSize: '2 - 5 Members',
    impressions: 12450,
    description: 'ETHIndia is India\'s largest Ethereum hackathon. Build decentralized applications, explore DeFi, NFTs, DAOs, and Web3 infrastructure. Connect with blockchain experts and venture capitalists.',
    eligibility: 'Open to developers, designers, and blockchain enthusiasts',
    themes: ['Ethereum', 'DeFi', 'NFTs', 'Smart Contracts', 'Web3', 'DAOs']
  }
];

export default function RecentHackathons() {
  const [selectedHackathon, setSelectedHackathon] = useState(hackathonsData[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [registeredHackathonIds, setRegisteredHackathonIds] = useState([]);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Handle sign out
  const handleSignOut = () => {
    const result = signOutUser();
    if (result.success) {
      navigate('/');
    }
  };

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserProfile(getUserProfile());
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Load registered hackathons
  useEffect(() => {
    const userHackathons = getUserHackathons();
    setRegisteredHackathonIds(userHackathons.map(h => h.id));
  }, []);

  // Listen for user data updates
  useEffect(() => {
    const handleUserDataUpdate = () => {
      const userHackathons = getUserHackathons();
      setRegisteredHackathonIds(userHackathons.map(h => h.id));
    };
    
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUserDataUpdate);
  }, []);

  // Handle hackathon registration
  const handleRegister = (hackathon, event) => {
    event.stopPropagation();
    
    const result = registerForHackathon(hackathon);
    if (result.success) {
      setRegisteredHackathonIds([...registeredHackathonIds, hackathon.id]);
      alert('Successfully registered for hackathon! Check your Dashboard to see it.');
    } else {
      alert(result.message);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={"dashboard-root" + (sidebarOpen ? "" : " sidebar-collapsed")}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <img src={logoImg} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userProfile.name}</div>
            <div className="sidebar-user-role">Student</div>
            <div className="sidebar-user-status">Active</div>
          </div>
          {sidebarOpen && (
            <button className="sidebar-toggle sidebar-toggle--sidebar" onClick={() => setSidebarOpen(false)} aria-label="Collapse sidebar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate('/dashboard')}>Dashboard</li>
            <li className="active">Recent Hackathons</li>
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
                  <path d="M9 6L15 12L9 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
          <input className="appbar-search" placeholder="Search" />
          <div className="appbar-user" ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="appbar-bell" style={{ color: '#181c23', fontSize: '1.3rem', margin: '0 6px 0 0' }}>🔔</span>
            <div className="appbar-user-info">
              <div className="appbar-user-name">{userProfile.name}</div>
            </div>
            <div
              className="appbar-user-avatar"
              style={{ background: '#e0e0e0', color: '#232733', fontWeight: 700, fontSize: '1.1rem', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setMenuOpen((open) => !open)}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {getUserInitials(userProfile.name)}
            </div>
            {menuOpen && (
              <div className="appbar-user-dropdown">
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>Profile</button>
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/settings'); }}>Settings</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout" onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Hackathons Content */}
        <div className="hackathons-page">
          {/* Left Panel - Hackathon List */}
          <div className="hackathons-list-panel">
            <div className="hackathons-list-header">
              <div className="hackathons-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Online</button>
                <button className="filter-btn">Hybrid</button>
              </div>
            </div>
            <div className="hackathons-scrollable-list">
              {hackathonsData.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className={`hackathon-list-item ${selectedHackathon.id === hackathon.id ? 'active' : ''}`}
                  onClick={() => setSelectedHackathon(hackathon)}
                >
                  <div className="hackathon-list-logo">{hackathon.logo}</div>
                  <div className="hackathon-list-info">
                    <h3 className="hackathon-list-title">{hackathon.name}</h3>
                    <p className="hackathon-list-community">{hackathon.community}</p>
                    <div className="hackathon-list-meta">
                      <span className="hackathon-meta-item">💰 {hackathon.prize}</span>
                      <span className="hackathon-meta-item">👥 {hackathon.registered} Registered</span>
                      <span className="hackathon-meta-item">⏰ {hackathon.daysLeft} days left</span>
                    </div>
                    <div className="hackathon-list-tags">
                      {hackathon.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="hackathon-tag">{tag}</span>
                      ))}
                      {hackathon.tags.length > 3 && <span className="hackathon-tag">+{hackathon.tags.length - 3}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Hackathon Details */}
          <div className="hackathon-detail-panel">
            <div className="hackathon-detail-header">
              <div className="hackathon-detail-logo-large">{selectedHackathon.logo}</div>
              <div className="hackathon-detail-title-section">
                <h1 className="hackathon-detail-title">{selectedHackathon.name}</h1>
                <p className="hackathon-detail-community">{selectedHackathon.community}</p>
                <div className="hackathon-detail-status">
                  <span className="status-badge">{selectedHackathon.status}</span>
                  <span className="updated-date">📅 Updated On: {selectedHackathon.updatedOn}</span>
                  <a href={selectedHackathon.officialWebsite} target="_blank" rel="noopener noreferrer" className="official-link">
                    🌐 Official website ↗
                  </a>
                </div>
                <div className="hackathon-detail-tags">
                  {selectedHackathon.tags.map((tag, idx) => (
                    <span key={idx} className="hackathon-detail-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="hackathon-detail-actions">
              <div className="hackathon-price">
                <span className="price-label">Prize Pool</span>
                <span className="price-value">{selectedHackathon.prize}</span>
              </div>
              <div className="action-icons">
                <button className="action-icon-btn" title="Add to favorites">❤️</button>
                <button className="action-icon-btn" title="Add to calendar">📅</button>
                <button className="action-icon-btn" title="Share">🔗</button>
              </div>
              {registeredHackathonIds.includes(selectedHackathon.id) ? (
                <button className="register-btn-large" style={{ background: '#10b981' }} disabled>
                  ✓ Registered
                </button>
              ) : (
                <button className="register-btn-large" onClick={(e) => handleRegister(selectedHackathon, e)}>
                  Register Now
                </button>
              )}
            </div>

            <div className="hackathon-detail-stats">
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <span className="stat-label">Registered</span>
                  <span className="stat-value">{selectedHackathon.registered}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <span className="stat-label">Registration Deadline</span>
                  <span className="stat-value">{selectedHackathon.registrationDeadline}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👀</div>
                <div className="stat-info">
                  <span className="stat-label">Impressions</span>
                  <span className="stat-value">{selectedHackathon.impressions}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👨‍👩‍👧‍👦</div>
                <div className="stat-info">
                  <span className="stat-label">Team Size</span>
                  <span className="stat-value">{selectedHackathon.teamSize}</span>
                </div>
              </div>
            </div>

            <div className="hackathon-detail-content">
              <section className="detail-section">
                <h3 className="section-title">About</h3>
                <p className="section-text">{selectedHackathon.description}</p>
              </section>

              <section className="detail-section">
                <h3 className="section-title">Eligibility</h3>
                <p className="section-text">{selectedHackathon.eligibility}</p>
              </section>

              <section className="detail-section">
                <h3 className="section-title">Themes & Tracks</h3>
                <div className="themes-grid">
                  {selectedHackathon.themes.map((theme, idx) => (
                    <div key={idx} className="theme-card">
                      <span className="theme-icon">🎯</span>
                      <span className="theme-name">{theme}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
