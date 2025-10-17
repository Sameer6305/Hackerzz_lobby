# Authentication System Documentation
**Hackerzz Lobby - Complete User Account Management**

## 📋 Overview

This authentication system implements a complete user registration and sign-in flow with account-based data management. Users must register before they can access the platform, and all their data (profile, communities, etc.) is tied to their account.

---

## 🎯 Key Features

### 1. **User Registration**
- ✅ Full name, email, college, phone collection
- ✅ Password validation (min 6 characters)
- ✅ Confirm password matching
- ✅ Email uniqueness validation
- ✅ Automatic profile creation upon registration

### 2. **User Sign In**
- ✅ Email and password authentication
- ✅ Session management
- ✅ Automatic profile loading
- ✅ Redirect to dashboard on success

### 3. **Protected Routes**
- ✅ Dashboard and all app pages require authentication
- ✅ Automatic redirect to sign-in if not authenticated
- ✅ Session persistence across page refreshes

### 4. **User Profile Management**
- ✅ Profile data tied to user account
- ✅ Data persists across sign-in/sign-out
- ✅ Profile updates saved to user account

### 5. **Sign Out**
- ✅ Clear user session
- ✅ Redirect to sign-in page
- ✅ Secure session management

---

## 🗂️ File Structure

### New Files Created

1. **src/utils/authUtils.js** (300+ lines)
   - Core authentication functions
   - User registration logic
   - Sign-in validation
   - Session management
   - Profile integration

2. **src/ProtectedRoute.js** (20 lines)
   - Route protection wrapper
   - Authentication checking
   - Automatic redirects

### Modified Files

1. **src/Register.js**
   - Complete registration form
   - Real-time validation
   - Error handling
   - User feedback

2. **src/SignIn.js**
   - Functional sign-in form
   - Authentication logic
   - Error messages
   - Session creation

3. **src/App.js**
   - Protected route implementation
   - Route configuration

4. **src/Dashboard.js**
   - Sign-out functionality
   - User session display

5. **src/utils/profileUtils.js**
   - Integration with auth system
   - Account-based profile loading

---

## 🔄 User Flow

### Registration Process

```
1. User visits /register
   ↓
2. Fills registration form:
   - Full Name *
   - Email Address *
   - College/University
   - Phone Number
   - Password (min 6 chars) *
   - Confirm Password *
   ↓
3. System validates:
   ✓ All required fields filled
   ✓ Valid email format
   ✓ Password meets requirements
   ✓ Passwords match
   ✓ Email not already registered
   ↓
4. Create user account:
   - Generate unique user ID
   - Store user data
   - Create default profile
   - Save to localStorage
   ↓
5. Success → Redirect to /signin
```

### Sign-In Process

```
1. User visits /signin
   ↓
2. Enters credentials:
   - Email
   - Password
   ↓
3. System validates:
   ✓ Email exists in database
   ✓ Password matches
   ↓
4. Create session:
   - Set currentUser in localStorage
   - Load user's profile data
   - Dispatch sign-in event
   ↓
5. Success → Redirect to /dashboard
```

### Protected Page Access

```
1. User tries to access /dashboard
   ↓
2. ProtectedRoute checks authentication
   ↓
3. If NOT authenticated:
   → Redirect to /signin
   ↓
4. If authenticated:
   → Load page
   → Display user's data
```

---

## 💾 Data Storage Structure

### localStorage Keys

#### 1. `registeredUsers` (Array)
Stores all registered user accounts:

```json
[
  {
    "id": "1729123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "registeredAt": "2025-10-17T10:30:00.000Z",
    "profileData": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "college": "MIT",
      "dateOfBirth": "",
      "gender": "",
      "branch": "Computer Science",
      "year": "3rd Year",
      "city": "Boston",
      "country": "USA",
      "bio": "Passionate developer",
      "githubUrl": "https://github.com/johndoe",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "portfolioUrl": "https://johndoe.dev",
      "skills": ["React", "Node.js", "Python"],
      "interests": ["AI", "Web3", "IoT"]
    }
  }
]
```

#### 2. `currentUser` (Object)
Stores active session:

```json
{
  "userId": "1729123456789",
  "email": "john@example.com",
  "name": "John Doe",
  "signedInAt": "2025-10-17T11:00:00.000Z"
}
```

#### 3. `profileData` (Object)
Active user's profile (same structure as in registeredUsers):

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  ...
}
```

#### 4. `communities` (Array)
User-created communities (tied to account):

```json
[
  {
    "id": "1729123456790",
    "communityName": "AI Innovators",
    "projectDomain": "Artificial Intelligence",
    "members": ["john@example.com", "jane@example.com"],
    "createdBy": "1729123456789",
    ...
  }
]
```

---

## 🔐 Security Features

### Current Implementation

1. **Email Validation**
   - Regex pattern matching
   - Duplicate prevention

2. **Password Requirements**
   - Minimum 6 characters
   - Confirmation matching

3. **Session Management**
   - localStorage-based sessions
   - Automatic expiration on sign-out

4. **Route Protection**
   - Middleware-level authentication
   - Automatic redirects

### ⚠️ Production Recommendations

**IMPORTANT**: This implementation is for development/demo purposes. For production:

1. **Password Security**
   ```javascript
   // DO NOT store plain text passwords
   // Use bcrypt or similar hashing:
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Backend Integration**
   ```javascript
   // Replace localStorage with API calls:
   const response = await fetch('/api/auth/register', {
     method: 'POST',
     body: JSON.stringify(userData)
   });
   ```

3. **JWT Tokens**
   ```javascript
   // Use JWT for session management:
   const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '24h' });
   ```

4. **HTTPS Only**
   - Enforce SSL/TLS
   - Secure cookie flags
   - HttpOnly cookies

5. **Rate Limiting**
   - Prevent brute force attacks
   - Login attempt limits

---

## 🛠️ API Reference

### authUtils.js Functions

#### `registerUser(userData)`
Registers a new user account.

**Parameters:**
```javascript
{
  name: string (required),
  email: string (required),
  password: string (required, min 6 chars),
  college: string (optional),
  phone: string (optional)
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  user: { id, name, email } | undefined
}
```

**Example:**
```javascript
const result = await registerUser({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  college: "MIT"
});

if (result.success) {
  console.log("Registration successful!");
}
```

---

#### `signInUser(email, password)`
Authenticates a user and creates a session.

**Parameters:**
```javascript
email: string (required)
password: string (required)
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  user: { id, name, email } | undefined
}
```

**Example:**
```javascript
const result = await signInUser("john@example.com", "password123");

if (result.success) {
  navigate('/dashboard');
}
```

---

#### `signOutUser()`
Ends the current user session.

**Returns:**
```javascript
{
  success: boolean,
  message: string
}
```

**Example:**
```javascript
const result = signOutUser();
if (result.success) {
  navigate('/signin');
}
```

---

#### `getCurrentUser()`
Gets the currently signed-in user.

**Returns:**
```javascript
{
  userId: string,
  email: string,
  name: string,
  signedInAt: string (ISO date)
} | null
```

**Example:**
```javascript
const currentUser = getCurrentUser();
if (currentUser) {
  console.log(`Welcome ${currentUser.name}!`);
}
```

---

#### `isAuthenticated()`
Checks if a user is currently signed in.

**Returns:** `boolean`

**Example:**
```javascript
if (isAuthenticated()) {
  // Show dashboard
} else {
  // Redirect to sign in
}
```

---

#### `updateUserProfile(profileData)`
Updates the current user's profile.

**Parameters:**
```javascript
{
  name: string,
  email: string,
  phone: string,
  college: string,
  ...
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string
}
```

---

## 🧪 Testing Guide

### Test Scenarios

#### 1. Registration Flow

**Test Case 1: Successful Registration**
```
1. Navigate to /register
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123"
   - Confirm: "test123"
3. Click Register
4. Expected: Success alert + redirect to /signin
```

**Test Case 2: Duplicate Email**
```
1. Register user A
2. Try to register user B with same email
3. Expected: Error "Email already registered"
```

**Test Case 3: Password Mismatch**
```
1. Fill form with different passwords
2. Click Register
3. Expected: Error "Passwords do not match"
```

**Test Case 4: Short Password**
```
1. Enter password with < 6 characters
2. Click Register
3. Expected: Error "Password must be at least 6 characters"
```

---

#### 2. Sign-In Flow

**Test Case 1: Successful Sign-In**
```
1. Register a user
2. Navigate to /signin
3. Enter correct credentials
4. Click Sign In
5. Expected: Redirect to /dashboard
6. Verify: User name appears in navbar
```

**Test Case 2: Wrong Password**
```
1. Enter correct email + wrong password
2. Click Sign In
3. Expected: Error "Incorrect password"
```

**Test Case 3: Unregistered Email**
```
1. Enter email that doesn't exist
2. Click Sign In
3. Expected: Error "No account found"
```

---

#### 3. Protected Routes

**Test Case 1: Direct Access Without Auth**
```
1. Clear localStorage (sign out)
2. Navigate to /dashboard directly
3. Expected: Redirect to /signin
```

**Test Case 2: Access After Sign-In**
```
1. Sign in successfully
2. Navigate to /dashboard
3. Expected: Dashboard loads with user data
```

---

#### 4. Profile Persistence

**Test Case 1: Profile Updates Persist**
```
1. Sign in as user A
2. Update profile
3. Sign out
4. Sign in as user A again
5. Expected: Updated profile data is loaded
```

**Test Case 2: Separate User Data**
```
1. Sign in as user A
2. Update profile
3. Sign out
4. Sign in as user B
5. Expected: User B sees their own data, not user A's
```

---

## 📊 Component Integration

### How Components Use Auth

#### Dashboard.js
```javascript
import { getUserProfile, getUserInitials } from './utils/profileUtils';
import { signOutUser } from './utils/authUtils';

// Load user's profile
const [userProfile, setUserProfile] = useState(getUserProfile());

// Sign out handler
const handleSignOut = () => {
  signOutUser();
  navigate('/signin');
};
```

#### EditProfile.js
```javascript
import { getUserProfile, saveUserProfile } from './utils/profileUtils';

// Load existing profile
useEffect(() => {
  const profile = getUserProfile();
  setForm(profile);
}, []);

// Save updates
const handleSubmit = () => {
  saveUserProfile(formData);
  // Automatically syncs with user account
};
```

#### ProtectedRoute.js
```javascript
import { isAuthenticated } from './utils/authUtils';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" />;
  }
  return children;
};
```

---

## 🔄 Event System

### Custom Events

#### `userSignedIn`
Fired when user successfully signs in.

```javascript
window.addEventListener('userSignedIn', (event) => {
  const user = event.detail;
  console.log(`${user.name} signed in`);
});
```

#### `userSignedOut`
Fired when user signs out.

```javascript
window.addEventListener('userSignedOut', () => {
  console.log('User signed out');
});
```

#### `profileUpdated`
Fired when profile is updated.

```javascript
window.addEventListener('profileUpdated', (event) => {
  const profile = event.detail;
  console.log('Profile updated:', profile);
});
```

---

## 🚀 Deployment Checklist

### Before Production

- [ ] **Replace localStorage with backend API**
- [ ] **Implement password hashing (bcrypt)**
- [ ] **Add JWT token authentication**
- [ ] **Set up HTTPS/SSL**
- [ ] **Implement rate limiting**
- [ ] **Add email verification**
- [ ] **Set up password reset flow**
- [ ] **Add session timeout**
- [ ] **Implement CSRF protection**
- [ ] **Add input sanitization**
- [ ] **Set up monitoring/logging**
- [ ] **Add 2FA (optional)**

---

## 📝 Usage Examples

### Complete Registration Flow

```javascript
// In Register.js
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const result = await registerUser({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    college: "MIT",
    phone: "+1234567890"
  });
  
  if (result.success) {
    alert(result.message);
    navigate('/signin');
  } else {
    setError(result.message);
  }
};
```

### Complete Sign-In Flow

```javascript
// In SignIn.js
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const result = await signInUser(email, password);
  
  if (result.success) {
    navigate('/dashboard');
  } else {
    setError(result.message);
  }
};
```

### Protected Component

```javascript
// In App.js
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 🎉 Summary

### What's Working Now

✅ **Complete Registration System**
- Form validation
- Email uniqueness
- Password confirmation
- Profile creation

✅ **Functional Sign-In**
- Credential validation
- Session creation
- Profile loading
- Dashboard redirect

✅ **Protected Routes**
- Auth middleware
- Automatic redirects
- Session checking

✅ **Account-Based Data**
- Profile tied to user
- Communities tied to user
- Data persistence

✅ **Sign Out**
- Session clearing
- Secure logout
- Redirect to sign-in

### Next Steps (Production)

🔜 Backend API integration
🔜 Password hashing
🔜 JWT tokens
🔜 Email verification
🔜 Password reset
🔜 Rate limiting
🔜 Advanced security

---

**Status**: ✅ **COMPLETE** - Full authentication system implemented and ready for testing!

**Last Updated**: October 17, 2025  
**Version**: 1.0.0  
**Author**: Hackerzz Lobby Team
