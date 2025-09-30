
import React from 'react';
import Navbar from './Navbar';
import './App.css';
import homeImage from './Img/home-image.png';
import aboutImage from './Img/about-image.png';


function App() {
  return (
    <>
      <Navbar />
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
        {/* Removed extra hero image to keep only the background */}
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
    </>
  );
}

export default App;
