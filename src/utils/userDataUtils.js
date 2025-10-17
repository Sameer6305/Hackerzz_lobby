/**
 * User Data Utils
 * Manages user-specific data like joined communities, projects, and activity stats
 */

import { getCurrentUser } from './authUtils';

/**
 * Get all user data for a specific user
 * @param {string} userId - User ID (email)
 * @returns {Object} User data object with communities, projects, hackathons, etc.
 */
export function getUserData(userId) {
  if (!userId) {
    return {
      communities: [],
      projects: [],
      hackathons: [],
      contributions: 0,
      contributionHistory: []
    };
  }

  const userDataKey = `userData_${userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  
  // Ensure all expected properties exist
  return {
    communities: userData.communities || [],
    projects: userData.projects || [],
    hackathons: userData.hackathons || [],
    contributions: userData.contributions || 0,
    contributionHistory: userData.contributionHistory || []
  };
}

/**
 * Get user-specific communities
 * @returns {Array} Array of community objects user has joined
 */
export function getUserCommunities() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  return userData.communities || [];
}

/**
 * Add a community to user's joined communities
 * @param {Object} community - Community object to add
 * @returns {Object} Result with success status and message
 */
export function joinCommunity(community) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'User not authenticated' };
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  
  if (!userData.communities) {
    userData.communities = [];
  }

  // Check if already joined
  const alreadyJoined = userData.communities.some(c => c.id === community.id);
  if (alreadyJoined) {
    return { success: false, message: 'Already joined this community' };
  }

  userData.communities.push({
    ...community,
    joinedAt: new Date().toISOString()
  });

  localStorage.setItem(userDataKey, JSON.stringify(userData));
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));

  return { success: true, message: 'Successfully joined community' };
}

/**
 * Remove a community from user's joined communities
 * @param {string} communityId - ID of community to leave
 * @returns {Object} Result with success status and message
 */
export function leaveCommunity(communityId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'User not authenticated' };
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  
  if (!userData.communities) {
    return { success: false, message: 'Not a member of any communities' };
  }

  userData.communities = userData.communities.filter(c => c.id !== communityId);
  localStorage.setItem(userDataKey, JSON.stringify(userData));
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));

  return { success: true, message: 'Successfully left community' };
}

/**
 * Get user's projects
 * @returns {Array} Array of project objects
 */
export function getUserProjects() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  return userData.projects || [];
}

/**
 * Add a project to user's projects
 * @param {Object} project - Project object to add
 * @returns {Object} Result with success status and message
 */
export function addProject(project) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'User not authenticated' };
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  
  if (!userData.projects) {
    userData.projects = [];
  }

  userData.projects.push({
    ...project,
    id: Date.now(),
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(userDataKey, JSON.stringify(userData));
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));

  return { success: true, message: 'Project added successfully' };
}

/**
 * Get user's activity stats (calculated from actual data)
 * @returns {Object} Activity stats object
 */
export function getUserActivityStats() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return {
      communitiesJoined: 0,
      projectsCreated: 0,
      hackathonsParticipated: 0,
      profileViews: 0,
      contributions: 0
    };
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');

  return {
    communitiesJoined: (userData.communities || []).length,
    projectsCreated: (userData.projects || []).length,
    hackathonsParticipated: (userData.hackathons || []).length,
    profileViews: userData.profileViews || 0,
    contributions: userData.contributions || 0
  };
}

/**
 * Increment profile view count
 */
export function incrementProfileViews() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  
  userData.profileViews = (userData.profileViews || 0) + 1;
  localStorage.setItem(userDataKey, JSON.stringify(userData));
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
}

/**
 * Record a contribution (e.g., post, comment, or other activity)
 */
export function recordContribution() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  
  userData.contributions = (userData.contributions || 0) + 1;
  localStorage.setItem(userDataKey, JSON.stringify(userData));
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
}

/**
 * Get user's hackathons
 * @returns {Array} Array of hackathon objects user has participated in
 */
export function getUserHackathons() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  return userData.hackathons || [];
}

/**
 * Register user for a hackathon
 * @param {Object} hackathon - Hackathon object
 * @returns {Object} Result with success status and message
 */
export function registerForHackathon(hackathon) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'User not authenticated' };
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  
  if (!userData.hackathons) {
    userData.hackathons = [];
  }

  // Check if already registered
  const alreadyRegistered = userData.hackathons.some(h => h.id === hackathon.id);
  if (alreadyRegistered) {
    return { success: false, message: 'Already registered for this hackathon' };
  }

  userData.hackathons.push({
    ...hackathon,
    registeredAt: new Date().toISOString()
  });

  localStorage.setItem(userDataKey, JSON.stringify(userData));
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));

  return { success: true, message: 'Successfully registered for hackathon' };
}

/**
 * Clear all user data (useful for testing or account deletion)
 */
export function clearUserData() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userDataKey = `userData_${currentUser.userId}`;
  localStorage.removeItem(userDataKey);
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: {} }));
}

/**
 * Calculate hackathon domain distribution based on user's joined communities
 * @returns {Array} Array of domain data with percentages for pie chart
 */
export function getDomainChartData() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }

  const userDataKey = `userData_${currentUser.userId}`;
  const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
  const communities = userData.communities || [];

  if (communities.length === 0) {
    return [];
  }

  // Count domains
  const domainCounts = {};
  communities.forEach(community => {
    const domain = community.projectDomain || 'General';
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
  });

  // Calculate percentages
  const total = communities.length;
  const domains = Object.entries(domainCounts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100)
  }));

  // Sort by count descending
  domains.sort((a, b) => b.count - a.count);

  // Assign colors
  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
  
  // Generate pie chart paths
  let currentAngle = 0;
  return domains.map((domain, index) => {
    const percentage = domain.percentage;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calculate path
    const startX = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
    const startY = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
    const endX = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
    const endY = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
    const largeArc = angle > 180 ? 1 : 0;

    const path = `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArc} 1 ${endX} ${endY} Z`;

    currentAngle = endAngle;

    return {
      name: domain.name,
      percentage: domain.percentage,
      color: colors[index % colors.length],
      path
    };
  });
}

/**
 * Calculate programming language distribution based on user profile skills
 * @returns {Array} Array of language data with percentages for pie chart
 */
export function getLanguageChartData() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }

  const profile = getUserProfile();
  
  // Get skills from profile - ensure it's a string
  let skills = profile.skills || '';
  
  // Convert to string if it's not already
  if (typeof skills !== 'string') {
    skills = String(skills);
  }
  
  if (!skills || skills.trim() === '') {
    return [];
  }

  // Parse skills and identify programming languages
  const languageKeywords = {
    'JavaScript': ['javascript', 'js', 'react', 'node', 'angular', 'vue'],
    'Python': ['python', 'django', 'flask', 'pandas', 'numpy'],
    'Java': ['java', 'spring', 'hibernate'],
    'C++': ['c++', 'cpp'],
    'TypeScript': ['typescript', 'ts'],
    'Go': ['go', 'golang'],
    'Rust': ['rust'],
    'PHP': ['php', 'laravel'],
    'Ruby': ['ruby', 'rails'],
    'Swift': ['swift', 'ios'],
    'Kotlin': ['kotlin', 'android']
  };

  const skillsLower = skills.toLowerCase();
  const languageCounts = {};

  // Count language mentions
  Object.entries(languageKeywords).forEach(([language, keywords]) => {
    keywords.forEach(keyword => {
      if (skillsLower.includes(keyword)) {
        languageCounts[language] = (languageCounts[language] || 0) + 1;
      }
    });
  });

  if (Object.keys(languageCounts).length === 0) {
    // Default distribution if no specific languages found
    return [];
  }

  // Calculate percentages
  const total = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);
  const languages = Object.entries(languageCounts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100)
  }));

  // Sort by count descending
  languages.sort((a, b) => b.count - a.count);

  // Assign colors based on language
  const languageColors = {
    'JavaScript': '#F7DF1E',
    'Python': '#3776AB',
    'Java': '#007396',
    'C++': '#00599C',
    'TypeScript': '#3178C6',
    'Go': '#00ADD8',
    'Rust': '#000000',
    'PHP': '#777BB4',
    'Ruby': '#CC342D',
    'Swift': '#FA7343',
    'Kotlin': '#7F52FF'
  };

  // Generate pie chart paths
  let currentAngle = 0;
  return languages.map((language) => {
    const percentage = language.percentage;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calculate path
    const startX = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
    const startY = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
    const endX = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
    const endY = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
    const largeArc = angle > 180 ? 1 : 0;

    const path = `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArc} 1 ${endX} ${endY} Z`;

    currentAngle = endAngle;

    return {
      name: language.name,
      percentage: language.percentage,
      color: languageColors[language.name] || '#6B7280',
      path
    };
  });
}

/**
 * Import getUserProfile to avoid circular dependency
 */
function getUserProfile() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { skills: '' };
  }

  const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
  return profileData;
}

/**
 * Calculate points breakdown based on user activities
 * @returns {Object} Points breakdown with categories
 */
export function getPointsBreakdown() {
  const stats = getUserActivityStats();
  
  // Calculate points based on activities
  const hackathonPoints = stats.hackathonsParticipated * 50; // 50 pts per hackathon
  const communityPoints = stats.communitiesJoined * 30; // 30 pts per community
  const projectPoints = stats.projectsCreated * 100; // 100 pts per project
  const contributionPoints = stats.contributions * 5; // 5 pts per contribution
  
  const totalPoints = hackathonPoints + communityPoints + projectPoints + contributionPoints;
  const maxPoints = 2000; // Maximum points for visualization

  return {
    hackathonParticipation: {
      label: 'Hackathon Participation',
      points: hackathonPoints,
      percentage: totalPoints > 0 ? Math.min((hackathonPoints / maxPoints) * 100, 100) : 0,
      icon: '🎯'
    },
    communityInvolvement: {
      label: 'Community Involvement',
      points: communityPoints,
      percentage: totalPoints > 0 ? Math.min((communityPoints / maxPoints) * 100, 100) : 0,
      icon: '💬'
    },
    projectCompletion: {
      label: 'Project Completion',
      points: projectPoints,
      percentage: totalPoints > 0 ? Math.min((projectPoints / maxPoints) * 100, 100) : 0,
      icon: '✅'
    },
    contributions: {
      label: 'Contributions',
      points: contributionPoints,
      percentage: totalPoints > 0 ? Math.min((contributionPoints / maxPoints) * 100, 100) : 0,
      icon: '⭐'
    },
    totalPoints
  };
}

/**
 * Get recent activity feed for user
 * @returns {Array} Array of recent activities with timestamps
 */
export function getRecentActivity() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }

  const userId = currentUser.userId;
  const userData = getUserData(userId);
  const activities = [];

  // Add hackathon participations
  userData.hackathons.forEach(hackathon => {
    activities.push({
      type: 'hackathon',
      title: `Participated in ${hackathon.name}`,
      timestamp: hackathon.joinedAt,
      icon: '🚀',
      color: '#4facfe'
    });
  });

  // Add community joins
  userData.communities.forEach(community => {
    activities.push({
      type: 'community',
      title: `Joined ${community.name} Community`,
      timestamp: community.joinedAt,
      icon: '👥',
      color: '#764ba2'
    });
  });

  // Add project completions
  userData.projects.forEach(project => {
    activities.push({
      type: 'project',
      title: `Completed ${project.name}`,
      timestamp: project.completedAt,
      icon: '📊',
      color: '#f093fb'
    });
  });

  // Add contributions (limit to recent ones)
  if (userData.contributionHistory && userData.contributionHistory.length > 0) {
    const recentContributions = userData.contributionHistory.slice(-5); // Last 5 contributions
    recentContributions.forEach(contribution => {
      activities.push({
        type: 'contribution',
        title: contribution.description || `Contributed to ${contribution.community}`,
        timestamp: contribution.timestamp,
        icon: '⭐',
        color: '#fbbf24'
      });
    });
  }

  // Sort by timestamp (most recent first)
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Return top 10 most recent activities
  return activities.slice(0, 10);
}

/**
 * Format timestamp to relative time (e.g., "2 days ago")
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted relative time
 */
export function formatRelativeTime(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
}
