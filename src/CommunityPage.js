import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials } from './utils/profileUtils';

export default function CommunityPage() {
  const { communityId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [community, setCommunity] = useState(null);
  const [message, setMessage] = useState('');
  const [newDeadline, setNewDeadline] = useState({ title: '', date: '', priority: 'normal' });
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const menuRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      setUserProfile(event.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Load community data
  useEffect(() => {
    const communities = JSON.parse(localStorage.getItem('communities') || '[]');
    const foundCommunity = communities.find(c => c.id === communityId);
    if (foundCommunity) {
      setCommunity(foundCommunity);
    } else {
      navigate('/communities');
    }
  }, [communityId, navigate]);

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

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [community?.messages, activeTab]);

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !community) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: userProfile.name,
      timestamp: new Date().toISOString(),
    };

    const updatedCommunity = {
      ...community,
      messages: [...(community.messages || []), newMessage],
    };

    updateCommunity(updatedCommunity);
    setMessage('');
  };

  // Add deadline
  const handleAddDeadline = (e) => {
    e.preventDefault();
    if (!newDeadline.title || !newDeadline.date || !community) return;

    const deadline = {
      id: Date.now().toString(),
      ...newDeadline,
      createdAt: new Date().toISOString(),
    };

    const updatedCommunity = {
      ...community,
      deadlines: [...(community.deadlines || []), deadline],
    };

    updateCommunity(updatedCommunity);
    setNewDeadline({ title: '', date: '', priority: 'normal' });
  };

  // Update community in localStorage
  const updateCommunity = (updatedCommunity) => {
    const communities = JSON.parse(localStorage.getItem('communities') || '[]');
    const index = communities.findIndex(c => c.id === communityId);
    if (index !== -1) {
      communities[index] = updatedCommunity;
      localStorage.setItem('communities', JSON.stringify(communities));
      setCommunity(updatedCommunity);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate days until deadline
  const getDaysUntil = (dateString) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!community) {
    return <div className="loading-state">Loading community...</div>;
  }

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
            <button className="appbar-back-btn" onClick={() => navigate('/communities')}>
              ← Back to Communities
            </button>
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
                <button className="appbar-user-dropdown-item">Settings</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout">Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Community Page Content */}
        <div className="community-page-content">
          {/* Community Header */}
          <div className="community-page-header">
            <div className="community-page-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              {community.projectDomain.charAt(0).toUpperCase()}
            </div>
            <div className="community-page-info">
              <h1 className="community-page-title">{community.communityName}</h1>
              <p className="community-page-subtitle">{community.projectName} • {community.projectDomain}</p>
              <div className="community-page-meta">
                <span>👥 {community.members.length || community.numberOfMembers || 0} members</span>
                <span>📅 Created {formatDate(community.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="community-tabs">
            <button className={`community-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              💬 Chat
            </button>
            <button className={`community-tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
              ℹ️ Information
            </button>
            <button className={`community-tab ${activeTab === 'deadlines' ? 'active' : ''}`} onClick={() => setActiveTab('deadlines')}>
              ⏰ Deadlines
            </button>
            <button className={`community-tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
              👥 Team Members
            </button>
          </div>

          {/* Tab Content */}
          <div className="community-tab-content">
            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="chat-container">
                <div className="chat-messages">
                  {community.messages && community.messages.length > 0 ? (
                    community.messages.map((msg) => (
                      <div key={msg.id} className="chat-message">
                        <div className="chat-message-avatar">
                          {msg.sender.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="chat-message-content">
                          <div className="chat-message-header">
                            <span className="chat-message-sender">{msg.sender}</span>
                            <span className="chat-message-time">{formatTime(msg.timestamp)}</span>
                          </div>
                          <div className="chat-message-text">{msg.text}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="chat-empty-state">
                      <span className="chat-empty-icon">💬</span>
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn">Send</button>
                </form>
              </div>
            )}

            {/* Information Tab */}
            {activeTab === 'info' && (
              <div className="info-container">
                <div className="info-section">
                  <h3 className="info-section-title">Hackathon Information</h3>
                  <div className="info-card">
                    <div className="info-row">
                      <span className="info-label">Hackathon Name:</span>
                      <span className="info-value">{community.hackathonName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Project Domain:</span>
                      <span className="info-value">{community.projectDomain}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Project Name:</span>
                      <span className="info-value">{community.projectName}</span>
                    </div>
                    {community.hackathonUrl && (
                      <div className="info-row">
                        <span className="info-label">Hackathon URL:</span>
                        <a href={community.hackathonUrl} target="_blank" rel="noopener noreferrer" className="info-link">
                          {community.hackathonUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h3 className="info-section-title">Project Description</h3>
                  <div className="info-card">
                    <p className="info-description">
                      {community.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {community.communityGuidelines && (
                  <div className="info-section">
                    <h3 className="info-section-title">Community Guidelines</h3>
                    <div className="info-card">
                      <p className="info-description">{community.communityGuidelines}</p>
                    </div>
                  </div>
                )}

                {community.contactEmail && (
                  <div className="info-section">
                    <h3 className="info-section-title">Contact</h3>
                    <div className="info-card">
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <a href={`mailto:${community.contactEmail}`} className="info-link">
                          {community.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Deadlines Tab */}
            {activeTab === 'deadlines' && (
              <div className="deadlines-container">
                <form className="deadline-form" onSubmit={handleAddDeadline}>
                  <h3 className="deadline-form-title">Add New Deadline</h3>
                  <div className="deadline-form-row">
                    <input
                      type="text"
                      className="deadline-input"
                      placeholder="Deadline title..."
                      value={newDeadline.title}
                      onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                      required
                    />
                    <input
                      type="date"
                      className="deadline-input"
                      value={newDeadline.date}
                      onChange={(e) => setNewDeadline({ ...newDeadline, date: e.target.value })}
                      required
                    />
                    <select
                      className="deadline-select"
                      value={newDeadline.priority}
                      onChange={(e) => setNewDeadline({ ...newDeadline, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <button type="submit" className="deadline-add-btn">Add Deadline</button>
                  </div>
                </form>

                <div className="deadlines-list">
                  {community.deadlines && community.deadlines.length > 0 ? (
                    community.deadlines.map((deadline) => {
                      const daysUntil = getDaysUntil(deadline.date);
                      let statusClass = 'normal';
                      if (daysUntil < 0) statusClass = 'overdue';
                      else if (daysUntil <= 2) statusClass = 'urgent';
                      else if (daysUntil <= 7) statusClass = 'warning';

                      return (
                        <div key={deadline.id} className={`deadline-card ${statusClass}`}>
                          <div className="deadline-card-header">
                            <h4 className="deadline-card-title">{deadline.title}</h4>
                            <span className={`deadline-priority ${deadline.priority}`}>
                              {deadline.priority}
                            </span>
                          </div>
                          <div className="deadline-card-body">
                            <span className="deadline-date">📅 {formatDate(deadline.date)}</span>
                            <span className={`deadline-countdown ${statusClass}`}>
                              {daysUntil < 0 
                                ? `Overdue by ${Math.abs(daysUntil)} days` 
                                : daysUntil === 0 
                                ? 'Today!' 
                                : `${daysUntil} days left`}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="deadlines-empty-state">
                      <span className="deadlines-empty-icon">⏰</span>
                      <p>No deadlines set. Add one above to keep track!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Team Members Tab */}
            {activeTab === 'members' && (
              <div className="members-container">
                <div className="members-stats">
                  <div className="members-stat-card">
                    <div className="members-stat-number">{community.members.length || community.numberOfMembers || 0}</div>
                    <div className="members-stat-label">Total Members</div>
                  </div>
                  <div className="members-stat-card">
                    <div className="members-stat-number">{community.members.length}</div>
                    <div className="members-stat-label">Active Members</div>
                  </div>
                </div>

                <div className="members-list">
                  {community.members && community.members.length > 0 ? (
                    community.members.map((member, index) => (
                      <div key={index} className="member-card">
                        <div className="member-avatar">
                          {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="member-info">
                          <h4 className="member-name">{member}</h4>
                          <p className="member-role">Team Member</p>
                        </div>
                        <span className="member-status online">Online</span>
                      </div>
                    ))
                  ) : (
                    <div className="members-empty-state">
                      <span className="members-empty-icon">👥</span>
                      <p>No team members added yet.</p>
                      <p className="members-empty-hint">Add team members when creating or editing the community.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
