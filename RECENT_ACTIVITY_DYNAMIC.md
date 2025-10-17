# Recent Activity - Dynamic Implementation

## Overview
The Recent Activity section in the Profile page now displays real user activities based on their actual interactions within the app, rather than showing hardcoded placeholder data.

## What Changed

### Before
- Showed 4 hardcoded activity items:
  - "Won 2nd place in AI Hackathon 2025"
  - "Joined React Developers Community"
  - "Completed Web3 Project"
  - "Participated in Global Code Jam"
- Same activities shown for all users
- No connection to actual user behavior

### After
- Dynamically generates activity feed from user data
- Shows real activities: hackathon participation, community joins, project completions, contributions
- Automatically sorted by timestamp (most recent first)
- Shows relative time (e.g., "2 days ago", "1 week ago")
- Empty state when no activities exist
- Updates in real-time when user performs actions

## New Functions Added

### 1. `getRecentActivity()`
**Location:** `src/utils/userDataUtils.js`

**Purpose:** Aggregates all user activities into a unified feed

**Returns:** Array of activity objects sorted by timestamp (newest first)

**Activity Types:**
- **Hackathons** 🚀
  - Title: "Participated in [Hackathon Name]"
  - Color: `#4facfe` (blue)
  
- **Communities** 👥
  - Title: "Joined [Community Name] Community"
  - Color: `#764ba2` (purple)
  
- **Projects** 📊
  - Title: "Completed [Project Name]"
  - Color: `#f093fb` (pink)
  
- **Contributions** ⭐
  - Title: "Contributed to [Community]" or custom description
  - Color: `#fbbf24` (yellow)

**Logic:**
1. Fetches user data for current user
2. Collects hackathons, communities, projects from userData
3. Collects recent contributions (last 5) from contributionHistory
4. Combines all activities into one array
5. Sorts by timestamp (descending)
6. Returns top 10 most recent activities

**Example Output:**
```javascript
[
  {
    type: 'community',
    title: 'Joined React Developers Community',
    timestamp: '2025-10-15T10:30:00Z',
    icon: '👥',
    color: '#764ba2'
  },
  {
    type: 'hackathon',
    title: 'Participated in AI Innovation Challenge',
    timestamp: '2025-10-12T14:20:00Z',
    icon: '🚀',
    color: '#4facfe'
  },
  // ... more activities
]
```

### 2. `formatRelativeTime(timestamp)`
**Location:** `src/utils/userDataUtils.js`

**Purpose:** Converts ISO timestamps to human-readable relative time

**Parameters:**
- `timestamp` (string): ISO 8601 timestamp

**Returns:** String representing relative time

**Examples:**
- Less than 1 minute: `"Just now"`
- 1-59 minutes: `"5 minutes ago"`
- 1-23 hours: `"3 hours ago"`
- 1-6 days: `"2 days ago"`
- 1-3 weeks: `"1 week ago"`
- 1-11 months: `"3 months ago"`
- 1+ years: `"2 years ago"`

**Logic:**
1. Calculates time difference between now and timestamp
2. Converts to appropriate unit (seconds, minutes, hours, days, weeks, months, years)
3. Returns formatted string with proper pluralization

## Profile.js Updates

### State Management
```javascript
const [recentActivity, setRecentActivity] = useState(getRecentActivity());
```

### Event Listeners
Updated `userDataUpdated` event to refresh recent activity:
```javascript
const handleUserDataUpdate = () => {
  setActivityStats(getUserActivityStats());
  setDomainChartData(getDomainChartData());
  setPointsBreakdown(getPointsBreakdown());
  setRecentActivity(getRecentActivity()); // ← Added
};
```

### Dynamic Rendering
```javascript
{recentActivity.length > 0 ? (
  recentActivity.map((activity, index) => (
    <div key={index} className="profile-activity-item">
      <div className="profile-activity-icon" style={{ backgroundColor: activity.color }}>
        {activity.icon}
      </div>
      <div className="profile-activity-content">
        <p className="profile-activity-title">{activity.title}</p>
        <p className="profile-activity-time">{formatRelativeTime(activity.timestamp)}</p>
      </div>
    </div>
  ))
) : (
  <div className="profile-empty-state">
    <p>No recent activities yet</p>
    <p className="profile-empty-state-subtitle">
      Join communities, participate in hackathons, or complete projects to see your activity here
    </p>
  </div>
)}
```

## How It Works

### Activity Tracking Flow

1. **User joins a community**
   - `Communities.js` or `CommunityPage.js` calls `joinCommunity()`
   - Community added to `userData.communities` with `joinedAt` timestamp
   - `userDataUpdated` event fired
   - Profile page listens and calls `setRecentActivity(getRecentActivity())`
   - New activity appears in Recent Activity section

2. **User registers for hackathon**
   - `RecentHackathons.js` calls `registerForHackathon()`
   - Hackathon added to `userData.hackathons` with `joinedAt` timestamp
   - `userDataUpdated` event fired
   - Activity feed updates automatically

3. **User completes a project**
   - `CommunityCreate.js` calls `addUserProject()`
   - Project added to `userData.projects` with `completedAt` timestamp
   - `userDataUpdated` event fired
   - Activity feed shows new project

4. **User makes a contribution**
   - `CommunityPage.js` calls `trackContribution()`
   - Contribution added to `userData.contributionHistory`
   - `userDataUpdated` event fired
   - Contribution appears in activity feed

### Real-Time Updates
All activities update in real-time thanks to the event-driven architecture:
```javascript
window.dispatchEvent(new Event('userDataUpdated'));
```

## Empty State
When a user has no activities:
- Shows message: "No recent activities yet"
- Provides guidance: "Join communities, participate in hackathons, or complete projects to see your activity here"
- Encourages user engagement

## Data Storage
Activities are stored in localStorage under user-specific keys:
```javascript
userData_user@example.com = {
  communities: [{name: 'React Developers', joinedAt: '...'}],
  hackathons: [{name: 'AI Hackathon', joinedAt: '...'}],
  projects: [{name: 'Web3 Project', completedAt: '...'}],
  contributionHistory: [{description: '...', timestamp: '...'}]
}
```

## Testing Guide

### Test Case 1: New User (Empty State)
1. Create new account or clear localStorage
2. Navigate to Profile page
3. ✅ Should see: "No recent activities yet" message

### Test Case 2: Join Community
1. Go to Communities page
2. Click "Join Community" on any community
3. Navigate to Profile page
4. ✅ Should see: "Joined [Community Name] Community" with "Just now" timestamp

### Test Case 3: Register for Hackathon
1. Go to Activity page (Recent Hackathons)
2. Click "Register Now" on any hackathon
3. Navigate to Profile page
4. ✅ Should see: "Participated in [Hackathon Name]" in recent activity

### Test Case 4: Multiple Activities
1. Join 2 communities
2. Register for 1 hackathon
3. Make a contribution in a community
4. Navigate to Profile page
5. ✅ Should see all 4 activities sorted by most recent first

### Test Case 5: Time Formatting
1. Join a community
2. Wait 2 minutes
3. Refresh Profile page
4. ✅ Should show "2 minutes ago"
5. Mock timestamp to be 2 days old in localStorage
6. Refresh
7. ✅ Should show "2 days ago"

### Test Case 6: Activity Limit
1. Perform 15 different activities
2. Navigate to Profile page
3. ✅ Should only show 10 most recent activities

## Benefits

### For Users
- **Transparency**: See exactly what you've done
- **Motivation**: Visual proof of progress and engagement
- **Memory Aid**: Remember which communities joined and when
- **Achievement Tracking**: See timeline of accomplishments

### For Development
- **Consistency**: All activity data comes from single source of truth
- **Maintainability**: One function to update, not hardcoded data
- **Scalability**: Easily add new activity types
- **Accuracy**: Always reflects real user behavior

## Future Enhancements

### Potential Additions
1. **Activity Filtering**
   - Filter by type (hackathons only, communities only, etc.)
   - Date range filtering

2. **Detailed Activity Pages**
   - Click activity to see details
   - Show related content (community page, hackathon details)

3. **Activity Statistics**
   - "You've joined 5 communities this month"
   - Monthly/weekly activity summaries

4. **Social Features**
   - Share activities to feed
   - Comment on activities
   - Like/react to achievements

5. **Achievements/Badges**
   - "First Community Join" badge
   - "10 Hackathons Completed" milestone

6. **Export Activity**
   - Download activity history as JSON/CSV
   - Generate activity reports

## Technical Notes

### Performance Considerations
- Activities limited to 10 items to prevent UI clutter
- Contributions limited to last 5 to avoid overwhelming feed
- Sorting happens once per data fetch, not on every render
- Uses array mapping for efficient React rendering

### Data Consistency
- All timestamps stored in ISO 8601 format
- Consistent activity object structure across types
- Validation in `getRecentActivity()` prevents malformed data

### Error Handling
- Returns empty array if user not logged in
- Gracefully handles missing userData properties
- Falls back to empty state if no activities exist

## Code Location Summary

| File | Lines | Purpose |
|------|-------|---------|
| `src/utils/userDataUtils.js` | 480-556 | `getRecentActivity()` function |
| `src/utils/userDataUtils.js` | 558-580 | `formatRelativeTime()` function |
| `src/Profile.js` | 6 | Import new functions |
| `src/Profile.js` | 16 | Add recentActivity state |
| `src/Profile.js` | 33 | Update event listener |
| `src/Profile.js` | 367-390 | Dynamic activity rendering |

## Summary
The Recent Activity section is now fully dynamic and accurately reflects each user's actual interactions with the platform. It provides real-time updates, proper time formatting, and helpful empty states for new users.
