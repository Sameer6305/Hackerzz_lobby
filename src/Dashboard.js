import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials } from './utils/profileUtils';
import { signOutUser } from './utils/authUtils';
import { getUserCommunities, getUserProjects, getUserActivityStats } from './utils/userDataUtils';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [userCommunities, setUserCommunities] = useState(getUserCommunities());
  const [userProjects, setUserProjects] = useState(getUserProjects());
  const [activityStats, setActivityStats] = useState(getUserActivityStats());
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
  React.useEffect(() => {
    const handleProfileUpdate = (event) => {
      setUserProfile(event.detail);
    };

    const handleUserDataUpdate = (event) => {
      setUserCommunities(getUserCommunities());
      setUserProjects(getUserProjects());
      setActivityStats(getUserActivityStats());
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

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
                    <path d="M15 18L9 12L15 6" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">Dashboard</li>
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

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Row 1 */}
          <div className="dashboard-card stats-card">
            <div className="stats-header">
              <button className="stats-btn stats-btn-primary" onClick={() => navigate('/community-create')}>Create New Community</button>
              <button className="stats-btn" onClick={() => navigate('/activity')}>Find Jobs</button>
            </div>
            <div className="stats-body">
              {activityStats.communitiesJoined === 0 && activityStats.projectsCreated === 0 && activityStats.hackathonsParticipated === 0 ? (
                <div className="stats-empty-state">
                  <span className="stats-empty-icon">📊</span>
                  <p className="stats-empty-text">No activity yet. Start by joining a community or participating in a hackathon!</p>
                </div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">{activityStats.communitiesJoined}</div>
                    <div className="stat-label">Communities</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{activityStats.projectsCreated}</div>
                    <div className="stat-label">Projects</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{activityStats.hackathonsParticipated}</div>
                    <div className="stat-label">Hackathons</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{activityStats.profileViews}</div>
                    <div className="stat-label">Profile Views</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{activityStats.contributions}</div>
                    <div className="stat-label">Contributions</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="dashboard-card projects-card">
            <div className="projects-header-wrapper">
              <div className="projects-header">My Projects</div>
              <button className="projects-add-btn" onClick={() => navigate('/communities')} title="Add New Project">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {userProjects.length === 0 ? (
              <div className="projects-empty-state">
                <span className="projects-empty-icon">📁</span>
                <p className="projects-empty-text">No projects yet</p>
                <p className="projects-empty-subtitle">Start your first project and showcase your work</p>
                <button className="project-btn-primary" onClick={() => navigate('/communities')}>Create Project</button>
              </div>
            ) : (
              <div className="projects-list">
                {[...userProjects].reverse().map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4fd18b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="project-content">
                      <div className="project-name">{project.name}</div>
                      <div className="project-description">{project.description}</div>
                      <div className="project-meta">
                        <span className="project-date">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="project-status-badge">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dashboard-card hackathons-card">
            <div className="hackathons-header">Latest Hackathons</div>
            <div className="hackathons-list">
              <div className="hackathon-item">
                <div className="hackathon-title">Global Code Jam 2024</div>
                <div className="hackathon-date">Oct 19, 2024</div>
                <span className="hackathon-status open">Registration Spots</span>
              </div>
              <div className="hackathon-item">
                <div className="hackathon-title">AI Immmurd Sprint</div>
                <div className="hackathon-date">Oct 13, 3005</div>
                <span className="hackathon-status upcoming">Upcoming</span>
              </div>
              <div className="hackathon-item">
                <div className="hackathon-title">Web Wicard Challenge</div>
                <div className="hackathon-date">Oct 26, 2633</div>
                <span className="hackathon-status open">Registration Open</span>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="dashboard-card communities-card">
            <div className="communities-header-wrapper">
              <div className="communities-header">Your Communities</div>
              <button className="communities-browse-btn" onClick={() => navigate('/communities')} title="Browse Communities">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Browse
              </button>
            </div>
            {userCommunities.length === 0 ? (
              <div className="communities-empty-state">
                <span className="communities-empty-icon">👥</span>
                <p className="communities-empty-text">You haven't joined any communities yet</p>
                <p className="communities-empty-subtitle">Connect with like-minded people and grow together</p>
                <button className="community-btn-join" onClick={() => navigate('/communities')}>Browse Communities</button>
              </div>
            ) : (
              <div className="communities-list">
                {userCommunities.map((community) => (
                  <div key={community.id} className="community-item" onClick={() => navigate(`/community/${community.id}`)}>
                    <div className="community-avatar">
                      {(community.projectDomain || community.communityName || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="community-info">
                      <div className="community-name">{community.communityName}</div>
                      <div className="community-meta">
                        <span className="community-members">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {community.members?.length || 0} members
                        </span>
                        <span className="community-domain-badge">{community.projectDomain || 'General'}</span>
                      </div>
                    </div>
                    <div className="community-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dashboard-card deadlines-card">
            <div className="deadlines-header">Deadlines Nearby</div>
            <div className="deadlines-list">
              <div className="deadline-item">
                <div className="deadline-title">Global Code Jam Registration</div>
                <div className="deadline-date">Nov 15, 2025</div>
                <span className="deadline-status urgent">2 days left</span>
              </div>
              <div className="deadline-item">
                <div className="deadline-title">AI Hackathon Submission</div>
                <div className="deadline-date">Nov 20, 2025</div>
                <span className="deadline-status warning">7 days left</span>
              </div>
              <div className="deadline-item">
                <div className="deadline-title">Web Dev Sprint Finals</div>
                <div className="deadline-date">Nov 25, 2025</div>
                <span className="deadline-status normal">12 days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}