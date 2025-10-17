import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials, isProfileComplete } from './utils/profileUtils';
import { signOutUser } from './utils/authUtils';
import { getUserActivityStats, getDomainChartData, getLanguageChartData, getPointsBreakdown, getRecentActivity, formatRelativeTime } from './utils/userDataUtils';

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [activityStats, setActivityStats] = useState(getUserActivityStats());
  const [domainChartData, setDomainChartData] = useState(getDomainChartData());
  const [languageChartData, setLanguageChartData] = useState(getLanguageChartData());
  const [pointsBreakdown, setPointsBreakdown] = useState(getPointsBreakdown());
  const [recentActivity, setRecentActivity] = useState(getRecentActivity());
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
    const handleProfileUpdate = () => {
      setUserProfile(getUserProfile());
      setLanguageChartData(getLanguageChartData()); // Update language chart when profile changes
    };

    const handleUserDataUpdate = () => {
      setActivityStats(getUserActivityStats());
      setDomainChartData(getDomainChartData()); // Update domain chart when communities change
      setPointsBreakdown(getPointsBreakdown()); // Update points when activities change
      setRecentActivity(getRecentActivity()); // Update recent activity when user performs actions
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

  // For new users - check if profile is complete
  const isNewUser = !isProfileComplete();

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

        {/* Profile Content */}
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header-section">
            <div className="profile-avatar-large">{getUserInitials(userProfile.name)}</div>
            <div className="profile-header-info">
              <h1 className="profile-name">{userProfile.name}</h1>
              <p className="profile-email">{userProfile.email}</p>
              <p className="profile-member-since">Member since October 2024</p>
            </div>
            <button className="profile-edit-btn" onClick={() => navigate('/edit-profile')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit Profile
            </button>
          </div>

          {isNewUser ? (
            /* New User Welcome Section */
            <div className="profile-welcome-section">
              <div className="profile-welcome-card">
                <div className="profile-welcome-icon">👋</div>
                <h2 className="profile-welcome-title">Welcome to Hackerzz Lobby!</h2>
                <p className="profile-welcome-text">
                  Get started by completing your profile and exploring communities. Join hackathons, collaborate on projects, and connect with developers worldwide!
                </p>
                <div className="profile-welcome-actions">
                  <button className="profile-welcome-btn-primary" onClick={() => navigate('/edit-profile')}>
                    Complete Your Profile
                  </button>
                  <button className="profile-welcome-btn-secondary" onClick={() => navigate('/communities')}>
                    Browse Communities
                  </button>
                </div>
              </div>

              {/* Quick Stats - Empty State */}
              <div className="profile-quick-stats">
                <div className="profile-stat-card-empty">
                  <div className="profile-stat-icon">🏆</div>
                  <div className="profile-stat-value">{activityStats.contributions}</div>
                  <div className="profile-stat-label">Total Points</div>
                  <p className="profile-stat-hint">Participate in hackathons to earn points</p>
                </div>
                <div className="profile-stat-card-empty">
                  <div className="profile-stat-icon">👥</div>
                  <div className="profile-stat-value">{activityStats.communitiesJoined}</div>
                  <div className="profile-stat-label">Communities</div>
                  <p className="profile-stat-hint">Join communities to collaborate</p>
                </div>
                <div className="profile-stat-card-empty">
                  <div className="profile-stat-icon">🚀</div>
                  <div className="profile-stat-value">{activityStats.hackathonsParticipated}</div>
                  <div className="profile-stat-label">Hackathons</div>
                  <p className="profile-stat-hint">Start your first hackathon journey</p>
                </div>
              </div>

              {/* Getting Started Guide */}
              <div className="profile-getting-started">
                <h3 className="profile-section-title">Getting Started</h3>
                <div className="profile-steps-grid">
                  <div className="profile-step-card">
                    <div className="profile-step-number">1</div>
                    <h4 className="profile-step-title">Complete Your Profile</h4>
                    <p className="profile-step-desc">Add your details, skills, and interests to help others connect with you.</p>
                    <button className="profile-step-btn" onClick={() => navigate('/edit-profile')}>Start Now</button>
                  </div>
                  <div className="profile-step-card">
                    <div className="profile-step-number">2</div>
                    <h4 className="profile-step-title">Join Communities</h4>
                    <p className="profile-step-desc">Discover and join communities that match your interests and expertise.</p>
                    <button className="profile-step-btn" onClick={() => navigate('/communities')}>Explore</button>
                  </div>
                  <div className="profile-step-card">
                    <div className="profile-step-number">3</div>
                    <h4 className="profile-step-title">Participate in Hackathons</h4>
                    <p className="profile-step-desc">Challenge yourself, learn new skills, and win exciting prizes!</p>
                    <button className="profile-step-btn" onClick={() => navigate('/recent-hackathons')}>View Hackathons</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Existing User Stats */
            <>
              <div className="profile-stats-grid">
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">🏆</div>
                  <div className="profile-stat-value">{activityStats.contributions}</div>
                  <div className="profile-stat-label">Total Points</div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">👥</div>
                  <div className="profile-stat-value">{activityStats.communitiesJoined}</div>
                  <div className="profile-stat-label">Communities Joined</div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">🚀</div>
                  <div className="profile-stat-value">{activityStats.hackathonsParticipated}</div>
                  <div className="profile-stat-label">Hackathons Participated</div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">🎯</div>
                  <div className="profile-stat-value">{activityStats.projectsCreated}</div>
                  <div className="profile-stat-label">Projects Completed</div>
                </div>
              </div>
            </>
          )}

          {/* Charts Section - Hidden for new users */}
          {!isNewUser && (
            <div className="profile-charts-section">
            {/* Domain Chart */}
            <div className="profile-chart-card">
              <h3 className="profile-chart-title">Hackathon Domains</h3>
              <div className="profile-chart-container">
                {domainChartData.length > 0 ? (
                  <>
                    <svg viewBox="0 0 100 100" className="profile-pie-chart">
                      {domainChartData.map((item, index) => (
                        <path
                          key={index}
                          d={item.path}
                          fill={item.color}
                          className="profile-pie-slice"
                        />
                      ))}
                    </svg>
                    <div className="profile-chart-legend">
                      {domainChartData.map((item, index) => (
                        <div key={index} className="profile-legend-item">
                          <div className="profile-legend-color" style={{ backgroundColor: item.color }}></div>
                          <span className="profile-legend-text">{item.name}</span>
                          <span className="profile-legend-value">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="profile-chart-empty">
                    <span className="profile-chart-empty-icon">📊</span>
                    <p className="profile-chart-empty-text">Join communities to see your domain distribution</p>
                  </div>
                )}
              </div>
            </div>

            {/* Language Chart */}
            <div className="profile-chart-card">
              <h3 className="profile-chart-title">Programming Languages</h3>
              <div className="profile-chart-container">
                {languageChartData.length > 0 ? (
                  <>
                    <svg viewBox="0 0 100 100" className="profile-pie-chart">
                      {languageChartData.map((item, index) => (
                        <path
                          key={index}
                          d={item.path}
                          fill={item.color}
                          className="profile-pie-slice"
                        />
                      ))}
                    </svg>
                    <div className="profile-chart-legend">
                      {languageChartData.map((item, index) => (
                        <div key={index} className="profile-legend-item">
                          <div className="profile-legend-color" style={{ backgroundColor: item.color }}></div>
                          <span className="profile-legend-text">{item.name}</span>
                          <span className="profile-legend-value">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="profile-chart-empty">
                    <span className="profile-chart-empty-icon">💻</span>
                    <p className="profile-chart-empty-text">Add skills to your profile to see language distribution</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Points Breakdown - Hidden for new users */}
          {!isNewUser && pointsBreakdown.totalPoints > 0 && (
          <div className="profile-points-section">
            <h3 className="profile-section-title">Points Breakdown</h3>
            <div className="profile-points-grid">
              <div className="profile-points-item">
                <div className="profile-points-item-header">
                  <span className="profile-points-item-icon">{pointsBreakdown.hackathonParticipation.icon}</span>
                  <span className="profile-points-item-title">{pointsBreakdown.hackathonParticipation.label}</span>
                </div>
                <div className="profile-points-bar">
                  <div className="profile-points-bar-fill" style={{ width: `${pointsBreakdown.hackathonParticipation.percentage}%`, backgroundColor: '#667eea' }}></div>
                </div>
                <span className="profile-points-item-value">{pointsBreakdown.hackathonParticipation.points} pts</span>
              </div>
              <div className="profile-points-item">
                <div className="profile-points-item-header">
                  <span className="profile-points-item-icon">{pointsBreakdown.communityInvolvement.icon}</span>
                  <span className="profile-points-item-title">{pointsBreakdown.communityInvolvement.label}</span>
                </div>
                <div className="profile-points-bar">
                  <div className="profile-points-bar-fill" style={{ width: `${pointsBreakdown.communityInvolvement.percentage}%`, backgroundColor: '#764ba2' }}></div>
                </div>
                <span className="profile-points-item-value">{pointsBreakdown.communityInvolvement.points} pts</span>
              </div>
              <div className="profile-points-item">
                <div className="profile-points-item-header">
                  <span className="profile-points-item-icon">{pointsBreakdown.projectCompletion.icon}</span>
                  <span className="profile-points-item-title">{pointsBreakdown.projectCompletion.label}</span>
                </div>
                <div className="profile-points-bar">
                  <div className="profile-points-bar-fill" style={{ width: `${pointsBreakdown.projectCompletion.percentage}%`, backgroundColor: '#f093fb' }}></div>
                </div>
                <span className="profile-points-item-value">{pointsBreakdown.projectCompletion.points} pts</span>
              </div>
              {pointsBreakdown.contributions.points > 0 && (
                <div className="profile-points-item">
                  <div className="profile-points-item-header">
                    <span className="profile-points-item-icon">{pointsBreakdown.contributions.icon}</span>
                    <span className="profile-points-item-title">{pointsBreakdown.contributions.label}</span>
                  </div>
                  <div className="profile-points-bar">
                    <div className="profile-points-bar-fill" style={{ width: `${pointsBreakdown.contributions.percentage}%`, backgroundColor: '#fbbf24' }}></div>
                  </div>
                  <span className="profile-points-item-value">{pointsBreakdown.contributions.points} pts</span>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Recent Activity - Hidden for new users */}
          {!isNewUser && (
          <div className="profile-activity-section">
            <h3 className="profile-section-title">Recent Activity</h3>
            <div className="profile-activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="profile-activity-item">
                    <div className="profile-activity-icon" style={{ backgroundColor: activity.color }}>
                      {activity.icon}
                    </div>
                    <div className="profile-activity-content">
                      <p className="profile-activity-title">{activity.title}</p>
                      <p className="profile-activity-time">{formatRelativeTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="profile-empty-state">
                  <p>No recent activities yet</p>
                  <p className="profile-empty-state-subtitle">Join communities, participate in hackathons, or complete projects to see your activity here</p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
