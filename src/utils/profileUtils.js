// Utility functions for user profile management

/**
 * Get user profile data from localStorage
 * @returns {Object} User profile data or default values
 */
export const getUserProfile = () => {
  try {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
  } catch (error) {
    console.error('Error loading profile data:', error);
  }
  
  // Return default profile if none exists
  return {
    name: 'Alex Turner',
    email: 'alex.turner@example.com',
    phone: '',
    dateOfBirth: '',
    gender: '',
    college: '',
    branch: '',
    year: '',
    passingYear: '',
    city: '',
    country: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [],
    interests: [],
  };
};

/**
 * Get user initials from name
 * @param {string} name - User's full name
 * @returns {string} User initials (e.g., "Alex Turner" -> "AT")
 */
export const getUserInitials = (name) => {
  if (!name) return 'AT';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get user first name
 * @param {string} name - User's full name
 * @returns {string} First name (e.g., "Alex Turner" -> "Alex")
 */
export const getUserFirstName = (name) => {
  if (!name) return 'Alex';
  return name.split(' ')[0];
};

/**
 * Save user profile data to localStorage
 * @param {Object} profileData - User profile data to save
 */
export const saveUserProfile = (profileData) => {
  try {
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('profileUpdated', { 
      detail: profileData 
    }));
    
    return true;
  } catch (error) {
    console.error('Error saving profile data:', error);
    return false;
  }
};

/**
 * Check if user has completed their profile
 * @returns {boolean} True if profile has required fields filled
 */
export const isProfileComplete = () => {
  const profile = getUserProfile();
  return !!(profile.name && profile.email && profile.college);
};
