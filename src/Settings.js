import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials } from './utils/profileUtils';
import { signOutUser } from './utils/authUtils';

export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile] = useState(getUserProfile());
  const [activeTab, setActiveTab] = useState('account');
  
  // Settings state
  const [settings, setSettings] = useState({
    // Account
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    
    // Preferences
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    
    // Notifications
    communityUpdates: true,
    hackathonReminders: true,
    deadlineAlerts: true,
    weeklyDigest: true,
  });

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Handle sign out
  const handleSignOut = () => {
    const result = signOutUser();
    if (result.success) {
      navigate('/');
    }
  };

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

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelect = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

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
            <li className="active">Settings</li>
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
            <h2 className="appbar-title">Settings</h2>
          </div>
          <div className="appbar-right" ref={menuRef}>
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
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/edit-profile'); }}>Edit Profile</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout" onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Settings Content */}
        <div className="settings-container">
          {/* Settings Sidebar */}
          <div className="settings-sidebar">
            <button 
              className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Account
            </button>
            <button 
              className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8ZM13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Notifications
            </button>
            <button 
              className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Privacy
            </button>
            <button 
              className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Preferences
            </button>
            <button 
              className={`settings-tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              About
            </button>
          </div>

          {/* Settings Content */}
          <div className="settings-content">
            {activeTab === 'account' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Account Settings</h2>
                <p className="settings-section-description">Manage your account preferences and settings</p>

                <div className="settings-card">
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Email Notifications</h3>
                      <p className="settings-item-description">Receive email notifications about your account activity</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.emailNotifications}
                        onChange={() => handleToggle('emailNotifications')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Push Notifications</h3>
                      <p className="settings-item-description">Get push notifications on your devices</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.pushNotifications}
                        onChange={() => handleToggle('pushNotifications')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">SMS Notifications</h3>
                      <p className="settings-item-description">Receive important updates via SMS</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.smsNotifications}
                        onChange={() => handleToggle('smsNotifications')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-card" style={{marginTop: '20px'}}>
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Account Email</h3>
                      <p className="settings-item-description">{userProfile.email}</p>
                    </div>
                    <button className="settings-btn-secondary">Change Email</button>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Password</h3>
                      <p className="settings-item-description">Last changed 30 days ago</p>
                    </div>
                    <button className="settings-btn-secondary">Change Password</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Notification Preferences</h2>
                <p className="settings-section-description">Choose what notifications you want to receive</p>

                <div className="settings-card">
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Community Updates</h3>
                      <p className="settings-item-description">Get notified about new posts and activities in your communities</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.communityUpdates}
                        onChange={() => handleToggle('communityUpdates')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Hackathon Reminders</h3>
                      <p className="settings-item-description">Receive reminders about upcoming hackathons</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.hackathonReminders}
                        onChange={() => handleToggle('hackathonReminders')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Deadline Alerts</h3>
                      <p className="settings-item-description">Get alerts for approaching deadlines</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.deadlineAlerts}
                        onChange={() => handleToggle('deadlineAlerts')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Weekly Digest</h3>
                      <p className="settings-item-description">Receive a weekly summary of your activity</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.weeklyDigest}
                        onChange={() => handleToggle('weeklyDigest')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Privacy Settings</h2>
                <p className="settings-section-description">Control who can see your information</p>

                <div className="settings-card">
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Profile Visibility</h3>
                      <p className="settings-item-description">Who can see your profile</p>
                    </div>
                    <select 
                      className="settings-select"
                      value={settings.profileVisibility}
                      onChange={(e) => handleSelect('profileVisibility', e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Show Email</h3>
                      <p className="settings-item-description">Display email on your public profile</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.showEmail}
                        onChange={() => handleToggle('showEmail')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Show Phone Number</h3>
                      <p className="settings-item-description">Display phone number on your public profile</p>
                    </div>
                    <label className="settings-toggle">
                      <input 
                        type="checkbox" 
                        checked={settings.showPhone}
                        onChange={() => handleToggle('showPhone')}
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-card" style={{marginTop: '20px'}}>
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Download Your Data</h3>
                      <p className="settings-item-description">Download a copy of your data</p>
                    </div>
                    <button className="settings-btn-secondary">Request Data</button>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Delete Account</h3>
                      <p className="settings-item-description">Permanently delete your account and all data</p>
                    </div>
                    <button className="settings-btn-danger">Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Preferences</h2>
                <p className="settings-section-description">Customize your experience</p>

                <div className="settings-card">
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Theme</h3>
                      <p className="settings-item-description">Choose your preferred theme</p>
                    </div>
                    <select 
                      className="settings-select"
                      value={settings.theme}
                      onChange={(e) => handleSelect('theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Language</h3>
                      <p className="settings-item-description">Select your preferred language</p>
                    </div>
                    <select 
                      className="settings-select"
                      value={settings.language}
                      onChange={(e) => handleSelect('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>

                  <div className="settings-item">
                    <div className="settings-item-info">
                      <h3 className="settings-item-title">Timezone</h3>
                      <p className="settings-item-description">Set your timezone for accurate timestamps</p>
                    </div>
                    <select 
                      className="settings-select"
                      value={settings.timezone}
                      onChange={(e) => handleSelect('timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Asia/Kolkata">India Standard Time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="settings-section">
                <h2 className="settings-section-title">About Hackerzz Lobby</h2>
                <p className="settings-section-description">Learn more about our platform</p>

                <div className="settings-card">
                  <div className="settings-about">
                    <div className="settings-about-logo">
                      <img src={logoImg} alt="Logo" style={{width: '80px', height: '80px'}} />
                    </div>
                    <h3 style={{fontSize: '1.5rem', fontWeight: 700, margin: '16px 0 8px', color: '#2d3748'}}>Hackerzz Lobby</h3>
                    <p style={{fontSize: '0.95rem', color: '#718096', marginBottom: '24px'}}>Version 1.0.0</p>
                    
                    <div className="settings-about-info">
                      <div className="settings-about-item">
                        <h4 style={{fontSize: '1rem', fontWeight: 600, color: '#2d3748', marginBottom: '8px'}}>Our Mission</h4>
                        <p style={{fontSize: '0.9rem', color: '#718096', lineHeight: '1.6'}}>
                          To connect developers, foster collaboration, and create opportunities through hackathons and community building.
                        </p>
                      </div>

                      <div className="settings-about-item" style={{marginTop: '20px'}}>
                        <h4 style={{fontSize: '1rem', fontWeight: 600, color: '#2d3748', marginBottom: '8px'}}>Features</h4>
                        <ul style={{fontSize: '0.9rem', color: '#718096', lineHeight: '1.8', paddingLeft: '20px'}}>
                          <li>Join and create developer communities</li>
                          <li>Participate in hackathons and coding challenges</li>
                          <li>Track your projects and contributions</li>
                          <li>Connect with like-minded developers</li>
                          <li>Stay updated with deadlines and notifications</li>
                        </ul>
                      </div>

                      <div className="settings-about-item" style={{marginTop: '20px'}}>
                        <h4 style={{fontSize: '1rem', fontWeight: 600, color: '#2d3748', marginBottom: '8px'}}>Contact & Support</h4>
                        <p style={{fontSize: '0.9rem', color: '#718096', lineHeight: '1.6'}}>
                          <strong>Email:</strong> support@hakerzzlobby.com<br/>
                          <strong>Website:</strong> www.hakerzzlobby.com<br/>
                          <strong>Social:</strong> @hakerzzlobby
                        </p>
                      </div>

                      <div className="settings-about-links" style={{marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                        <button className="settings-btn-secondary">Terms of Service</button>
                        <button className="settings-btn-secondary">Privacy Policy</button>
                        <button className="settings-btn-secondary">Help Center</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-card" style={{marginTop: '20px', textAlign: 'center', padding: '20px'}}>
                  <p style={{fontSize: '0.85rem', color: '#a0aec0', margin: 0}}>
                    © 2025 Hackerzz Lobby. All rights reserved.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
