// Authentication utility functions for managing user accounts

/**
 * Register a new user account
 * @param {Object} userData - User registration data
 * @returns {Object} Success/error response
 */
export const registerUser = async (userData) => {
  try {
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return {
        success: false,
        message: 'Please fill all required fields'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }

    // Validate password strength (min 6 characters)
    if (userData.password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long'
      };
    }

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Check if email already exists
    const emailExists = existingUsers.some(user => user.email === userData.email);
    if (emailExists) {
      return {
        success: false,
        message: 'Email already registered. Please sign in.'
      };
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In production, this should be hashed
      registeredAt: new Date().toISOString(),
      profileData: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        dateOfBirth: '',
        gender: '',
        college: userData.college || '',
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
      }
    };

    // Add to users array
    existingUsers.push(newUser);

    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    return {
      success: true,
      message: 'Registration successful! Please sign in.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.'
    };
  }
};

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Success/error response with user data
 */
export const signInUser = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        message: 'Please enter email and password'
      };
    }

    // Get registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Find user by email
    const user = registeredUsers.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        message: 'No account found with this email. Please register first.'
      };
    }

    // Verify password
    if (user.password !== password) {
      return {
        success: false,
        message: 'Incorrect password. Please try again.'
      };
    }

    // Create session
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      signedInAt: new Date().toISOString()
    };

    // Store current session
    localStorage.setItem('currentUser', JSON.stringify(session));

    // Store user's profile data
    localStorage.setItem('profileData', JSON.stringify(user.profileData));

    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('userSignedIn', { 
      detail: session 
    }));

    return {
      success: true,
      message: 'Sign in successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };

  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'Sign in failed. Please try again.'
    };
  }
};

/**
 * Sign out current user
 */
export const signOutUser = () => {
  try {
    // Clear current session
    localStorage.removeItem('currentUser');
    
    // Dispatch sign out event
    window.dispatchEvent(new CustomEvent('userSignedOut'));

    return {
      success: true,
      message: 'Signed out successfully'
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      message: 'Sign out failed'
    };
  }
};

/**
 * Get current signed-in user
 * @returns {Object|null} Current user session or null
 */
export const getCurrentUser = () => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is signed in
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

/**
 * Update user profile data
 * @param {Object} profileData - Updated profile data
 * @returns {Object} Success/error response
 */
export const updateUserProfile = (profileData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'No user signed in'
      };
    }

    // Get all registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find and update user
    const userIndex = registeredUsers.findIndex(u => u.id === currentUser.userId);
    if (userIndex !== -1) {
      registeredUsers[userIndex].profileData = profileData;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    // Update localStorage profileData
    localStorage.setItem('profileData', JSON.stringify(profileData));

    // Dispatch update event
    window.dispatchEvent(new CustomEvent('profileUpdated', { 
      detail: profileData 
    }));

    return {
      success: true,
      message: 'Profile updated successfully'
    };

  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      message: 'Failed to update profile'
    };
  }
};

/**
 * Get all registered users (admin function)
 * @returns {Array} List of registered users
 */
export const getAllUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};
