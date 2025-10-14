

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import './App.css';

import homeImage from './Img/home-image.png';
import aboutImage from './Img/about-image.png';


import SignIn from './SignIn';
import Register from './Register';
import Dashboard from './Dashboard';
import Profile from './Profile';
import CommunityCreate from './CommunityCreate';
import RecentHackathons from './RecentHackathons';
import Communities from './Communities';
import Notifications from './Notifications';
import Deadlines from './Deadlines';
import Activity from './Activity';



function MainContent() {
  return (
    <>
      <div className="background-image-fade" />
      {/* Hero Section with large container and background */}
      <div className="hero-main-container">
        <div className="hero-content">
          <h1 className="hero-title-live">
            <span className="hero-title-main">Hackerzz</span><br />
            <span className="hero-title-sub">Lobby</span>
          </h1>
          <p className="glow-on-hover">Welcome to Hackerzz Lobby ,a place where coders and innovators connect, collaborate, and grow. Our platform makes hackathons simple by helping you create communities, find teammates, and manage projects all in one place. With an easy dashboard and real-time collaboration, you can focus on building ideas into reality while we take care of the organization.</p>
        </div>
      </div>

      {/* Featured Hackathons Section - smaller cards, grouped, with gap */}
      <div className="featured-section-group">
        <h2 className="featured-title">Featured Hackathons</h2>
        <div className="featured-hackathons-list-small">
          <div className="hackathon-card-small">
            <img src={homeImage} alt="Global Code Jam 2024" className="hackathon-img-small" />
            <div className="hackathon-info-small">
              <h3>Global Code Jam 2024</h3>
              <p>Score: 222</p>
              <p>Active now</p>
              <button className="hackathon-btn">View Details</button>
            </div>
          </div>
          <div className="hackathon-card-small">
            <img src={homeImage} alt="Global Code Jam 2024" className="hackathon-img-small" />
            <div className="hackathon-info-small">
              <h3>Global Code Jam 2024</h3>
              <p>Score: 231</p>
              <p>Active now</p>
              <button className="hackathon-btn">View Details</button>
            </div>
          </div>
          <div className="hackathon-card-small">
            <img src={homeImage} alt="Showcase" className="hackathon-img-small" />
            <div className="hackathon-info-small">
              <h3>Community Showcase</h3>
              <p>Score: 223</p>
              <p>Active now</p>
              <button className="hackathon-btn">View Profile</button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="about-section">
        <h1 className="about-title">
          <span>Connecting the World’s</span>
          <br />
          <span>Innovators</span>
        </h1>
        <p className="about-subtitle">The Story Behind the Lobby</p>
      </div>

      {/* Mission Section (below About) */}
      <div className="mission-section">
        <h2 className="mission-title">Our Mission</h2>
        <div className="mission-content">
          <div className="mission-quote-card" style={{ backgroundImage: `url(${aboutImage})` }}>
            <span className="mission-quote-mark">“</span>
            <span className="mission-quote-text">
              <span className="mission-quote-main">Innovation thrives on collaboration. We build future, together.</span>
            </span>
          </div>
          <div className="mission-text">
            <p>Hackerzz Lobby was born from a simple idea: innovation on collaboration. We saw brilliant developers, designers, and creators, and struggling to find the right teams and challenges.</p>
            <p>Our mission is break down barriers, creating a centalized platform where talent meets opportunity, and groundbreaking ideas come to life.</p>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div id="features" className="features-section">
        <h2 className="features-title">Our Features: Innovate. Collaborate. Achieve.</h2>
        <div className="features-list">
          <div className="feature-card">
            <div className="feature-number">1.</div>
            <div className="feature-content">
              <div className="feature-title">Join or Create</div>
              <div className="feature-desc">Find Your Team, Start Your Project. Seamless form and discover existing communities.</div>
              <div className="feature-actions">
                <button className="feature-btn-primary">Create New Community</button>
                <button className="feature-btn-secondary">Explore Communities</button>
              </div>
            </div>
            <div className="feature-icon">{/* brain icon */}🧠</div>
          </div>
          <div className="feature-card">
            <div className="feature-number">2.</div>
            <div className="feature-content">
              <div className="feature-title">Build & Collaborate</div>
              <div className="feature-desc">Your Community Hub for Success. Real-time file sharing, and project management tools.</div>
            </div>
            <div className="feature-icon">{/* calendar icon */}📅</div>
          </div>
          <div className="feature-card">
            <div className="feature-number">3.</div>
            <div className="feature-content">
              <div className="feature-title">Access Knowledge & Deadlines</div>
              <div className="feature-desc">Contextual information and timeline-based and automated deadlines.</div>
            </div>
            <div className="feature-icon">{/* chat icon */}💬</div>
          </div>
          <div className="feature-card">
            <div className="feature-number">4.</div>
            <div className="feature-content">
              <div className="feature-title">Showcase & Grow</div>
              <div className="feature-desc">Share your work, get feedback, and expand your network.</div>
            </div>
            <div className="feature-icon">{/* trophy icon */}🏆</div>
          </div>
        </div>
      </div>

      {/* Footer / Contact Section */}
      <footer id="contact" className="footer-section">
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>Email: hackerzzlobby@example.com</p>
          <p>Phone: +1 234 567 8901</p>
          <p>Address: 123 Innovation Drive, Tech City, Country</p>
          <p style={{marginTop: '18px', fontSize: '0.95rem', color: '#aaa'}}>© 2025 Hackerzz Lobby. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

import DashboardAppbar from './DashboardAppbar';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isProfile = location.pathname === '/profile';
  const isCommunityCreate = location.pathname === '/community-create';
  const isRecentHackathons = location.pathname === '/recent-hackathons';
  const isCommunities = location.pathname === '/communities';
  const isNotifications = location.pathname === '/notifications';
  const isDeadlines = location.pathname === '/deadlines';
  const isActivity = location.pathname === '/activity';
  return (
    <>
      {!isDashboard && !isProfile && !isCommunityCreate && !isRecentHackathons && !isCommunities && !isNotifications && !isDeadlines && !isActivity && <Navbar />}
      {(isProfile || isCommunityCreate) && <DashboardAppbar />}
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community-create" element={<CommunityCreate />} />
        <Route path="/recent-hackathons" element={<RecentHackathons />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/deadlines" element={<Deadlines />} />
        <Route path="/activity" element={<Activity />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
