import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials } from './utils/profileUtils';
import { joinCommunity, leaveCommunity, getUserCommunities, recordContribution } from './utils/userDataUtils';
import { signOutUser } from './utils/authUtils';

export default function CommunityPage() {
  const { communityId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [community, setCommunity] = useState(null);
  const [message, setMessage] = useState('');
  const [newDeadline, setNewDeadline] = useState({ title: '', date: '', priority: 'normal' });
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [isMember, setIsMember] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const menuRef = useRef(null);
  const chatEndRef = useRef(null);
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
      
      // Check if user is a member
      const userCommunities = getUserCommunities();
      const isMemberCheck = userCommunities.some(c => c.id === communityId);
      setIsMember(isMemberCheck);
      
      // Load existing AI analysis if available
      if (foundCommunity.aiAnalysis) {
        setAiAnalysis(foundCommunity.aiAnalysis);
      } else if (isMemberCheck && foundCommunity.hackathonName) {
        // If member but no analysis yet, fetch it
        fetchAIAnalysis(foundCommunity.hackathonName);
      }
    } else {
      navigate('/communities');
    }
  }, [communityId, navigate]);

  // Listen for user data updates
  useEffect(() => {
    const handleUserDataUpdate = () => {
      const userCommunities = getUserCommunities();
      setIsMember(userCommunities.some(c => c.id === communityId));
    };
    
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUserDataUpdate);
  }, [communityId]);

  // Fetch AI analysis for hackathon
  const fetchAIAnalysis = async (hackathonName) => {
    if (!hackathonName) return;
    
    setIsLoadingAnalysis(true);
    setAnalysisError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/analyze-hackathon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hackathon_name: hackathonName }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAiAnalysis(data.data);
        
        // Store analysis in community data
        const communities = JSON.parse(localStorage.getItem('communities') || '[]');
        const index = communities.findIndex(c => c.id === communityId);
        if (index !== -1) {
          communities[index].aiAnalysis = data.data;
          localStorage.setItem('communities', JSON.stringify(communities));
        }
      } else {
        setAnalysisError(data.error || 'Failed to analyze hackathon');
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      setAnalysisError('Unable to connect to AI service. Please make sure the backend server is running.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Handle join/leave community
  const handleJoinLeave = () => {
    if (!community) return;
    
    if (isMember) {
      // Show confirmation modal for leaving
      setShowLeaveModal(true);
    } else {
      const result = joinCommunity(community);
      if (result.success) {
        setIsMember(true);
        alert('Successfully joined the community!');
        
        // Fetch AI analysis when user enrolls
        if (community.hackathonName) {
          fetchAIAnalysis(community.hackathonName);
        }
      } else {
        alert(result.message);
      }
    }
  };

  // Confirm leave
  const confirmLeave = () => {
    const result = leaveCommunity(community.id);
    if (result.success) {
      setIsMember(false);
      setShowLeaveModal(false);
      alert('You have left the community.');
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
    
    // Record contribution
    recordContribution();
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
      
      // Dispatch custom event to notify other components
      console.log('Dispatching deadlinesUpdated event');
      window.dispatchEvent(new CustomEvent('deadlinesUpdated', { 
        detail: { communityId, deadlines: updatedCommunity.deadlines } 
      }));
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
                <button className="appbar-user-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/settings'); }}>Settings</button>
                <div className="appbar-user-dropdown-divider" />
                <button className="appbar-user-dropdown-item appbar-user-dropdown-signout" onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Community Page Content */}
        <div className="community-page-content">
          {/* Community Header */}
          <div className="community-page-header">
            <div className="community-page-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              {(community.projectDomain || community.communityName || 'C').charAt(0).toUpperCase()}
            </div>
            <div className="community-page-info">
              <h1 className="community-page-title">{community.communityName}</h1>
              <p className="community-page-subtitle">{community.projectName} • {community.projectDomain || 'General'}</p>
              <div className="community-page-meta">
                <span>👥 {community.members?.length || community.numberOfMembers || 0} members</span>
                <span>📅 Created {formatDate(community.createdAt)}</span>
              </div>
            </div>
            
            {/* Professional Join/Leave Button */}
            {isMember ? (
              <button 
                className="leave-community-btn" 
                onClick={handleJoinLeave}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                Leave Community
              </button>
            ) : (
              <button 
                className="join-community-btn" 
                onClick={handleJoinLeave}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Join Community
              </button>
            )}
          </div>

          {/* Leave Confirmation Modal */}
          {showLeaveModal && (
            <div className="modal-overlay" onClick={() => setShowLeaveModal(false)}>
              <div className="leave-modal" onClick={(e) => e.stopPropagation()}>
                <div className="leave-modal-header">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <h2>Leave Community?</h2>
                </div>
                <p className="leave-modal-text">
                  Are you sure you want to leave <strong>{community.communityName}</strong>? 
                  You'll lose access to chats, deadlines, and community resources.
                </p>
                <div className="leave-modal-actions">
                  <button 
                    className="modal-btn modal-cancel-btn" 
                    onClick={() => setShowLeaveModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="modal-btn modal-leave-btn" 
                    onClick={confirmLeave}
                  >
                    Leave Community
                  </button>
                </div>
              </div>
            </div>
          )}

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
                {/* Basic Hackathon Information */}
                <div className="info-section">
                  <h3 className="info-section-title">Hackathon Information</h3>
                  <div className="info-card">
                    <div className="info-row">
                      <span className="info-label">Hackathon Name:</span>
                      <span className="info-value">{community.hackathonName || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Project Domain:</span>
                      <span className="info-value">{community.projectDomain || 'General'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Project Name:</span>
                      <span className="info-value">{community.projectName || 'N/A'}</span>
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

                {/* AI-Generated Analysis Section */}
                {isMember && (
                  <>
                    {isLoadingAnalysis && (
                      <div className="ai-loading-section">
                        <div className="ai-loading-spinner"></div>
                        <p className="ai-loading-text">🤖 AI is analyzing hackathon information...</p>
                      </div>
                    )}

                    {analysisError && (
                      <div className="ai-error-section">
                        <div className="ai-error-icon">⚠️</div>
                        <p className="ai-error-text">{analysisError}</p>
                        <button 
                          className="ai-retry-btn" 
                          onClick={() => fetchAIAnalysis(community.hackathonName)}
                        >
                          Retry Analysis
                        </button>
                      </div>
                    )}

                    {aiAnalysis && !isLoadingAnalysis && (
                      <>
                        {/* AI Summary - Optimized Layout */}
                        <div className="info-section ai-section">
                          <h3 className="info-section-title">
                            <span className="ai-badge">AI-Powered</span> Hackathon Summary
                          </h3>
                          <div className="info-card ai-card">
                            <p className="ai-summary">{aiAnalysis.summary}</p>
                            {aiAnalysis.source_url && (
                              <a href={aiAnalysis.source_url} target="_blank" rel="noopener noreferrer" className="ai-source-link">
                                📄 Source: {aiAnalysis.source_url}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Timeline */}
                        {aiAnalysis.timeline && (
                          <div className="info-section ai-section">
                            <h3 className="info-section-title">⏰ Timeline & Deadlines</h3>
                            <div className="info-card ai-timeline-card">
                              <div className="ai-timeline-row">
                                <span className="ai-timeline-label">Registration Deadline:</span>
                                <span className="ai-timeline-value">{aiAnalysis.timeline.registration_deadline}</span>
                              </div>
                              <div className="ai-timeline-row">
                                <span className="ai-timeline-label">Submission Deadline:</span>
                                <span className="ai-timeline-value">{aiAnalysis.timeline.submission_deadline}</span>
                              </div>
                              <div className="ai-timeline-row">
                                <span className="ai-timeline-label">Current Stage:</span>
                                <span className="ai-timeline-value highlight">{aiAnalysis.timeline.current_stage}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Technologies & Tools */}
                        {aiAnalysis.technologies && aiAnalysis.technologies.length > 0 && (
                          <div className="info-section ai-section">
                            <h3 className="info-section-title">🛠️ Required Technologies & Tools</h3>
                            <div className="ai-technologies-grid">
                              {aiAnalysis.technologies.map((tech, index) => (
                                <div key={index} className="ai-tech-card">
                                  <div className="ai-tech-header">
                                    <h4 className="ai-tech-name">{tech.name}</h4>
                                    <span className={`ai-tech-difficulty ${tech.difficulty.toLowerCase()}`}>
                                      {tech.difficulty}
                                    </span>
                                  </div>
                                  <p className="ai-tech-description">{tech.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Requirements */}
                        {aiAnalysis.requirements && aiAnalysis.requirements.length > 0 && (
                          <div className="info-section ai-section">
                            <h3 className="info-section-title">📋 Requirements</h3>
                            <div className="info-card">
                              <ul className="ai-requirements-list">
                                {aiAnalysis.requirements.map((req, index) => (
                                  <li key={index} className="ai-requirement-item">
                                    <span className="ai-requirement-bullet">✓</span>
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Reference Projects */}
                        {aiAnalysis.reference_projects && aiAnalysis.reference_projects.length > 0 && (
                          <div className="info-section ai-section">
                            <h3 className="info-section-title">💡 Reference Projects</h3>
                            <div className="ai-projects-grid">
                              {aiAnalysis.reference_projects.map((project, index) => (
                                <div key={index} className="ai-project-card">
                                  <h4 className="ai-project-title">{project.title}</h4>
                                  <p className="ai-project-description">{project.description}</p>
                                  <p className="ai-project-relevance">
                                    <strong>Why relevant:</strong> {project.relevance}
                                  </p>
                                  {project.github_url && (
                                    <a 
                                      href={project.github_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="ai-project-link"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                                      </svg>
                                      View on GitHub
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tool Guides */}
                        {aiAnalysis.tool_guides && aiAnalysis.tool_guides.length > 0 && (
                          <div className="info-section ai-section">
                            <h3 className="info-section-title">📚 Tool Guides & Resources</h3>
                            {aiAnalysis.tool_guides.map((guide, index) => (
                              <div key={index} className="info-card ai-guide-card">
                                <h4 className="ai-guide-title">{guide.tool_name}</h4>
                                <div className="ai-guide-section">
                                  <h5 className="ai-guide-subtitle">Quick Start</h5>
                                  <p className="ai-guide-text">{guide.quick_start}</p>
                                </div>
                                <div className="ai-guide-section">
                                  <h5 className="ai-guide-subtitle">Key Resources</h5>
                                  <ul className="ai-guide-resources">
                                    {guide.key_resources.map((resource, idx) => (
                                      <li key={idx}>{resource}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="ai-guide-section">
                                  <h5 className="ai-guide-subtitle">Hackathon Context</h5>
                                  <p className="ai-guide-text">{guide.hackathon_context}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tips */}
                        {aiAnalysis.tips && aiAnalysis.tips.length > 0 && (
                          <div className="info-section ai-section">
                            <h3 className="info-section-title">💡 Practical Tips</h3>
                            <div className="info-card">
                              <ul className="ai-tips-list">
                                {aiAnalysis.tips.map((tip, index) => (
                                  <li key={index} className="ai-tip-item">
                                    <span className="ai-tip-number">{index + 1}</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* Project Description */}
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
                    <div className="members-stat-number">{community.members?.length || community.numberOfMembers || 0}</div>
                    <div className="members-stat-label">Total Members</div>
                  </div>
                  <div className="members-stat-card">
                    <div className="members-stat-number">{community.members?.length || 0}</div>
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
