import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';

// Real tech news data
const techNewsData = [
  {
    id: 1,
    title: 'Google Announces Gemini 2.0 AI Model',
    description: 'Google unveils Gemini 2.0, the next generation of AI with multimodal capabilities and improved reasoning.',
    source: 'TechCrunch',
    time: '2 hours ago',
    category: 'AI',
    icon: '🤖',
    link: '#'
  },
  {
    id: 2,
    title: 'MLH Season 2025 Kickoff: 150+ Hackathons Announced',
    description: 'Major League Hacking announces 150+ global hackathons for 2025 season with $5M in prizes.',
    source: 'MLH News',
    time: '5 hours ago',
    category: 'Hackathons',
    icon: '🏆',
    link: '#'
  },
  {
    id: 3,
    title: 'GitHub Copilot Workspace Goes Live',
    description: 'GitHub launches Copilot Workspace, an AI-native development environment that helps plan, build, test, and run code.',
    source: 'GitHub Blog',
    time: '8 hours ago',
    category: 'Development',
    icon: '💻',
    link: '#'
  },
  {
    id: 4,
    title: 'AWS Re:Invent 2025: New Cloud Computing Services',
    description: 'Amazon Web Services announces groundbreaking cloud services including AI-powered infrastructure and serverless innovations.',
    source: 'AWS',
    time: '12 hours ago',
    category: 'Cloud',
    icon: '☁️',
    link: '#'
  },
  {
    id: 5,
    title: 'React 19 Release Candidate Available',
    description: 'React team releases React 19 RC with new features including React Compiler, Server Components improvements, and Actions.',
    source: 'React Blog',
    time: '1 day ago',
    category: 'Web Dev',
    icon: '⚛️',
    link: '#'
  },
  {
    id: 6,
    title: 'OpenAI DevDay 2025: GPT-5 Sneak Peek',
    description: 'OpenAI showcases GPT-5 capabilities at DevDay with enhanced reasoning, longer context windows, and multimodal features.',
    source: 'OpenAI',
    time: '1 day ago',
    category: 'AI',
    icon: '🧠',
    link: '#'
  },
  {
    id: 7,
    title: 'Ethereum Dencun Upgrade Goes Live',
    description: 'Major Ethereum upgrade implements proto-danksharding, reducing L2 transaction costs by up to 90%.',
    source: 'CoinDesk',
    time: '2 days ago',
    category: 'Blockchain',
    icon: '⛓️',
    link: '#'
  },
  {
    id: 8,
    title: 'Microsoft Build 2025: Copilot for Everything',
    description: 'Microsoft announces Copilot integration across all development tools, from VS Code to Azure and Microsoft 365.',
    source: 'Microsoft',
    time: '2 days ago',
    category: 'Tools',
    icon: '🛠️',
    link: '#'
  }
];

export default function Notifications() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
            <div className="sidebar-user-name">Ales Turner</div>
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
            <li className="active">Notifications</li>
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
              <div className="appbar-user-name">Ales Turner</div>
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

        {/* Notifications Content */}
        <div className="notifications-content">
          <h1 className="notifications-page-title">Notifications</h1>

          {/* Scrollable Notifications Section */}
          <div className="notifications-scrollable">
            {/* Community Messages Section */}
            <section className="notifications-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">💬</span>
                  Community Messages
                </h2>
              </div>
              <div className="empty-notifications">
                <div className="empty-notifications-icon">📭</div>
                <h3 className="empty-notifications-title">No messages yet</h3>
                <p className="empty-notifications-text">
                  You haven't received any messages from your communities. Join or create a community to start connecting!
                </p>
                <button className="empty-notifications-btn" onClick={() => navigate('/communities')}>
                  Browse Communities
                </button>
              </div>
            </section>

            {/* Tech News Section */}
            <section className="notifications-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">📰</span>
                  Tech & Hackathon News
                </h2>
              </div>
              <div className="news-list">
                {techNewsData.map((news, index) => (
                  <div key={news.id} className="news-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="news-icon-wrapper">
                      <div className="news-category-icon">{news.icon}</div>
                    </div>
                    <div className="news-content">
                      <div className="news-header">
                        <h3 className="news-title">{news.title}</h3>
                        <span className="news-category-badge">{news.category}</span>
                      </div>
                      <p className="news-description">{news.description}</p>
                      <div className="news-meta">
                        <span className="news-source">{news.source}</span>
                        <span className="news-divider">•</span>
                        <span className="news-time">{news.time}</span>
                      </div>
                    </div>
                    <button className="news-action-btn" onClick={() => window.open(news.link, '_blank')}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
