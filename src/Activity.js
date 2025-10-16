import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logoImg from './Img/logo.png';
import { getUserProfile, getUserInitials } from './utils/profileUtils';

export default function Activity() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('internships');
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Listen for profile updates
  React.useEffect(() => {
    const handleProfileUpdate = (event) => {
      setUserProfile(event.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
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

  const internshipsData = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Google',
      location: 'Mountain View, CA / Remote',
      duration: 'Summer 2026 (12 weeks)',
      stipend: '$8,000/month',
      type: 'Full-time',
      skills: ['Java', 'Python', 'Data Structures'],
      deadline: 'Nov 15, 2025',
      description: 'Work on large-scale systems and products used by billions of users.'
    },
    {
      id: 2,
      title: 'ML Research Intern',
      company: 'Microsoft Research',
      location: 'Redmond, WA',
      duration: 'Summer 2026 (10-12 weeks)',
      stipend: '$9,500/month',
      type: 'Research',
      skills: ['PyTorch', 'TensorFlow', 'Research'],
      deadline: 'Nov 30, 2025',
      description: 'Collaborate with researchers on cutting-edge AI and ML projects.'
    },
    {
      id: 3,
      title: 'Frontend Developer Intern',
      company: 'Meta',
      location: 'Menlo Park, CA / Remote',
      duration: 'Summer 2026 (12 weeks)',
      stipend: '$8,500/month',
      type: 'Full-time',
      skills: ['React', 'JavaScript', 'GraphQL'],
      deadline: 'Dec 1, 2025',
      description: 'Build user interfaces for Facebook, Instagram, and WhatsApp.'
    },
    {
      id: 4,
      title: 'Cloud Engineering Intern',
      company: 'Amazon (AWS)',
      location: 'Seattle, WA / Multiple',
      duration: 'Summer 2026 (12 weeks)',
      stipend: '$7,800/month',
      type: 'Full-time',
      skills: ['AWS', 'Linux', 'Distributed Systems'],
      deadline: 'Nov 20, 2025',
      description: 'Design and implement cloud infrastructure solutions at scale.'
    },
    {
      id: 5,
      title: 'Data Science Intern',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      duration: 'Summer 2026 (12 weeks)',
      stipend: '$9,000/month',
      type: 'Full-time',
      skills: ['Python', 'SQL', 'Statistics'],
      deadline: 'Dec 10, 2025',
      description: 'Analyze data to improve content recommendations and user experience.'
    }
  ];

  const jobsData = [
    {
      id: 1,
      title: 'Junior Software Developer',
      company: 'Shopify',
      location: 'Ottawa, Canada / Remote',
      type: 'Full-time',
      experience: '0-2 years',
      salary: '$70,000 - $90,000',
      skills: ['Ruby', 'Rails', 'JavaScript'],
      deadline: 'Nov 25, 2025',
      description: 'Build and maintain e-commerce solutions for millions of merchants.'
    },
    {
      id: 2,
      title: 'Frontend Engineer (New Grad)',
      company: 'Stripe',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      experience: '0-1 years',
      salary: '$120,000 - $150,000',
      skills: ['React', 'TypeScript', 'CSS'],
      deadline: 'Dec 5, 2025',
      description: 'Create elegant user experiences for global payment infrastructure.'
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'Atlassian',
      location: 'Sydney, Australia / Remote',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '$80,000 - $110,000',
      skills: ['Java', 'Spring Boot', 'Microservices'],
      deadline: 'Nov 18, 2025',
      description: 'Work on Jira, Confluence, and other collaboration tools.'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'GitLab',
      location: 'Remote (Worldwide)',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '$90,000 - $130,000',
      skills: ['Docker', 'Kubernetes', 'CI/CD'],
      deadline: 'Dec 15, 2025',
      description: 'Build and maintain the DevOps platform used by millions of developers.'
    },
    {
      id: 5,
      title: 'Mobile Developer (React Native)',
      company: 'Discord',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '$110,000 - $145,000',
      skills: ['React Native', 'iOS', 'Android'],
      deadline: 'Nov 28, 2025',
      description: 'Develop features for the Discord mobile app used by 150M+ users.'
    }
  ];

  const renderInternships = () => (
    <div className="activity-grid">
      {internshipsData.map((intern, index) => (
        <div key={intern.id} className="activity-card" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="activity-card-header">
            <div>
              <h3 className="activity-card-title">{intern.title}</h3>
              <p className="activity-card-subtitle">{intern.company}</p>
            </div>
            <span className="activity-badge activity-badge-internship">{intern.type}</span>
          </div>
          <p className="activity-card-description">{intern.description}</p>
          <div className="activity-card-info">
            <div className="activity-info-item">
              <span className="activity-info-icon">📍</span>
              <span>{intern.location}</span>
            </div>
            <div className="activity-info-item">
              <span className="activity-info-icon">⏱️</span>
              <span>{intern.duration}</span>
            </div>
            <div className="activity-info-item">
              <span className="activity-info-icon">💵</span>
              <span>{intern.stipend}</span>
            </div>
          </div>
          <div className="activity-skills">
            {intern.skills.map((skill, i) => (
              <span key={i} className="activity-skill-tag">{skill}</span>
            ))}
          </div>
          <div className="activity-card-footer">
            <span className="activity-deadline">⏰ Apply by: {intern.deadline}</span>
            <button className="activity-apply-btn">Apply Now</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderJobs = () => (
    <div className="activity-grid">
      {jobsData.map((job, index) => (
        <div key={job.id} className="activity-card" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="activity-card-header">
            <div>
              <h3 className="activity-card-title">{job.title}</h3>
              <p className="activity-card-subtitle">{job.company}</p>
            </div>
            <span className="activity-badge activity-badge-job">{job.type}</span>
          </div>
          <p className="activity-card-description">{job.description}</p>
          <div className="activity-card-info">
            <div className="activity-info-item">
              <span className="activity-info-icon">📍</span>
              <span>{job.location}</span>
            </div>
            <div className="activity-info-item">
              <span className="activity-info-icon">💼</span>
              <span>{job.experience}</span>
            </div>
            <div className="activity-info-item">
              <span className="activity-info-icon">💰</span>
              <span>{job.salary}</span>
            </div>
          </div>
          <div className="activity-skills">
            {job.skills.map((skill, i) => (
              <span key={i} className="activity-skill-tag">{skill}</span>
            ))}
          </div>
          <div className="activity-card-footer">
            <span className="activity-deadline">⏰ Apply by: {job.deadline}</span>
            <button className="activity-apply-btn">Apply Now</button>
          </div>
        </div>
      ))}
    </div>
  );

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
            <li className="active">Activity</li>
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
          <input className="appbar-search" placeholder="Search opportunities..." />
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

        {/* Activity Content */}
        <div className="activity-content">
          <h1 className="activity-page-title">Opportunities & Activity</h1>
          
          {/* Tabs */}
          <div className="activity-tabs">
            <button 
              className={`activity-tab ${activeTab === 'internships' ? 'active' : ''}`}
              onClick={() => setActiveTab('internships')}
            >
              💼 Internships ({internshipsData.length})
            </button>
            <button 
              className={`activity-tab ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              🚀 Jobs ({jobsData.length})
            </button>
          </div>

          {/* Content based on active tab */}
          <div className="activity-tab-content">
            {activeTab === 'internships' && renderInternships()}
            {activeTab === 'jobs' && renderJobs()}
          </div>
        </div>
      </div>
    </div>
  );
}
