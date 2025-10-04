import './App.css';

export default function Dashboard() {
  return (
    <div className="dashboard-outer">
      {/* Top App Bar */}
      <div className="dashboard-appbar">
        <div className="dashboard-appbar-logo">
          <span className="dashboard-logo-icon">🦾</span>Hackerzz Lobby
        </div>
        <input className="dashboard-search" placeholder="Search..." />
        <div className="dashboard-appbar-actions">
          <span className="dashboard-appbar-bell">🔔</span>
          <span className="dashboard-appbar-user">Alex Turner</span>
        </div>
      </div>
      <div className="dash-root dash-root-flex">
        {/* Sidebar */}
        <aside className="dash-sidebar">
          <div className="dash-logo dashboard-sidebar-logo"><span className="dashboard-logo-icon">🦾</span>Hackerzz Lobby</div>
          <ul className="dash-menu">
            <li className="active">Dashboard</li>
            <li>Recent Hackathons</li>
            <li>Communities</li>
            <li>Inbox</li>
            <li>Deadlines</li>
            <li>Activity</li>
          </ul>
          <button className="dash-signout">Sign Out</button>
        </aside>
        {/* Main Content */}
        <main className="dash-main dashboard-main">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="dashboard-header-title">Your Hacker Stats</div>
            <div className="dashboard-header-actions">
              <button className="dashboard-create-btn">Create New Community</button>
              <button className="dashboard-header-btn">View Profile</button>
              <button className="dashboard-header-btn">Connect Apps</button>
            </div>
          </div>
          <div className="dashboard-cards-row">
            <div className="dashboard-card dashboard-card-stats">
              <div className="dashboard-card-title">Your Hacker Stats</div>
              <div className="dashboard-card-content dashboard-stats">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">🏆</span>
                  3 Active Communities
                </div>
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">🚀</span>
                  Top 5% Community Contributor
                </div>
              </div>
            </div>
            <div className="dashboard-card dashboard-card-projects">
              <div className="dashboard-card-title">My Projects</div>
              <button className="dashboard-create-btn dashboard-create-btn-small">+ Create New project</button>
              <div className="dashboard-card-content">
                <div className="dashboard-project-card">
                  <span className="dashboard-project-icon">📦</span>
                  <div>
                    <div className="dashboard-project-title">React Learners</div>
                    <div className="dashboard-project-desc">Priority</div>
                  </div>
                  <span className="dashboard-project-status dashboard-project-status-soon">Soon</span>
                </div>
                <div className="dashboard-project-card">
                  <span className="dashboard-project-icon">💡</span>
                  <div>
                    <div className="dashboard-project-title">AI Innovate</div>
                  </div>
                  <span className="dashboard-project-status dashboard-project-status-active">Active</span>
                </div>
                <div className="dashboard-project-card">
                  <span className="dashboard-project-icon">⭐</span>
                  <div>
                    <div className="dashboard-project-title">Web Wizard</div>
                  </div>
                  <span className="dashboard-project-status dashboard-project-status-live">Live</span>
                </div>
              </div>
            </div>
            <div className="dashboard-card dashboard-card-deadlines">
              <div className="dashboard-card-title">Upcoming Deadlines</div>
              <div className="dashboard-card-content">
                <div className="dashboard-deadline-list">
                  <div className="dashboard-deadline-item">
                    <span className="dashboard-deadline-status dashboard-deadline-status-soon">Soon</span>
                    <div>
                      <div className="dashboard-deadline-title">React Project</div>
                      <div className="dashboard-deadline-desc">20.3.31</div>
                    </div>
                  </div>
                  <div className="dashboard-deadline-item">
                    <span className="dashboard-deadline-status dashboard-deadline-status-active">Active</span>
                    <div>
                      <div className="dashboard-deadline-title">Web Wizard</div>
                      <div className="dashboard-deadline-desc">15 Hetto St Hackathon</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-cards-row">
            <div className="dashboard-card dashboard-card-communities">
              <div className="dashboard-card-title">Your Communities</div>
              <div className="dashboard-card-content">
                <div className="dashboard-community-list">
                  <div className="dashboard-community-item">
                    <span className="dashboard-community-icon">�</span>
                    <div>
                      <div className="dashboard-community-title">React Learners</div>
                      <div className="dashboard-community-desc">Pioneering all the plans to connect with the most of the client.</div>
                    </div>
                    <span className="dashboard-community-status dashboard-community-status-active">Active</span>
                  </div>
                  <div className="dashboard-community-item">
                    <span className="dashboard-community-icon">⭐</span>
                    <div>
                      <div className="dashboard-community-title">Web Wizard</div>
                      <div className="dashboard-community-desc">Vision driven group to solve ideas. My restmaker teammates/friends.</div>
                    </div>
                    <span className="dashboard-community-status dashboard-community-status-inactive">Inactive</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-card dashboard-card-activity">
              <div className="dashboard-card-title">Recent Activity</div>
              <div className="dashboard-card-content">
                <div className="dashboard-activity-list">
                  <div className="dashboard-activity-item">
                    <span className="dashboard-activity-icon">🔗</span>
                    <div>
                      <div className="dashboard-activity-title">Joined React Learners</div>
                      <div className="dashboard-activity-desc">Joined event beyond the stack - the chief</div>
                    </div>
                    <span className="dashboard-activity-status dashboard-activity-status-active">Active</span>
                  </div>
                  <div className="dashboard-activity-item">
                    <span className="dashboard-activity-icon">🚀</span>
                    <div>
                      <div className="dashboard-activity-title">Created AI Hackathon</div>
                      <div className="dashboard-activity-desc">2 Hetto St Hackathon</div>
                    </div>
                    <span className="dashboard-activity-status dashboard-activity-status-active">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Removed duplicate deadlines row, now included above */}
        </main>
      </div>
    </div>
  );
}