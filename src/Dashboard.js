import React from 'react';
import './App.css';

const communities = [
  {
    name: 'Quantum Coders',
    subtitle: 'Future Tech Sprint',
    status: 'Active',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Quantum Coders',
    subtitle: 'Future Tech Sprint',
    status: 'Active',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    name: 'Quantum Coders',
    subtitle: 'Future Tech Sprint',
    status: 'Active',
    avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
  },
  {
    name: 'Quantum Coders',
    subtitle: 'Future Tech Sprint',
    status: 'Running',
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
  },
];

const Dashboard = () => (
  <div className="dashboard-bg">
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Hackerzz Lobby</div>
        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li>Recent Hackathons</li>
          <li>Your Communities</li>
          <li>Profile</li>
          <li>Statistics</li>
          <li>Ratings</li>
        </ul>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-header">
          <button className="dashboard-create-btn">+ Create New Community</button>
          <button className="dashboard-join-btn">Join Community</button>
        </div>
        <h2 className="dashboard-title">Dashboard Overview</h2>
        <div className="dashboard-section-title">Your Communities</div>
        <div className="dashboard-cards">
          {communities.map((c, i) => (
            <div className="dashboard-card" key={i}>
              <div className="dashboard-card-avatar">
                <img src={c.avatar} alt="avatar" />
              </div>
              <div className="dashboard-card-info">
                <div className="dashboard-card-name">{c.name}</div>
                <div className="dashboard-card-sub">{c.subtitle}</div>
              </div>
              <div className={`dashboard-card-status ${c.status === 'Active' ? 'active' : 'running'}`}>{c.status}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
);

export default Dashboard;
