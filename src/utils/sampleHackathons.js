/**
 * Sample Hackathon Data for Testing AI Integration
 * 
 * This file contains real hackathon examples that can be used
 * to populate the communities in your application.
 * 
 * To use:
 * 1. Open browser console
 * 2. Run: localStorage.setItem('communities', JSON.stringify(sampleHackathons))
 * 3. Refresh the page
 */

const sampleHackathons = [
  {
    id: 'hack-1',
    name: 'MLH Hackathon 2025',
    hackathonName: 'MLH Hackathon 2025',
    description: 'Major League Hacking\'s premier global hackathon event bringing together students and developers to build innovative projects in 24 hours.',
    projectDomain: 'Full Stack Development',
    projectName: 'Innovation Challenge',
    hackathonUrl: 'https://mlh.io',
    numberOfMembers: 0,
    members: [],
    createdAt: new Date().toISOString(),
    messages: [],
    deadlines: [
      {
        id: 'dl-1',
        title: 'Project Idea Submission',
        date: '2025-11-01',
        priority: 'high',
        createdAt: new Date().toISOString()
      }
    ],
    communityGuidelines: 'Respect all participants, collaborate openly, and build something awesome!',
    contactEmail: 'team@mlh.io'
  },
  {
    id: 'hack-2',
    name: 'Google Cloud Hackathon',
    hackathonName: 'Google Cloud Hackathon',
    description: 'Build the next generation of cloud-native applications using Google Cloud Platform, AI/ML, and modern development tools.',
    projectDomain: 'Cloud Computing & AI',
    projectName: 'Cloud Native Solutions',
    hackathonUrl: 'https://cloud.google.com/blog/topics/developers-practitioners/google-cloud-developer-challenges',
    numberOfMembers: 0,
    members: [],
    createdAt: new Date().toISOString(),
    messages: [],
    deadlines: [
      {
        id: 'dl-2',
        title: 'Registration Deadline',
        date: '2025-10-28',
        priority: 'urgent',
        createdAt: new Date().toISOString()
      },
      {
        id: 'dl-3',
        title: 'Final Submission',
        date: '2025-11-15',
        priority: 'high',
        createdAt: new Date().toISOString()
      }
    ],
    communityGuidelines: 'Follow Google Cloud terms of service and build ethical AI solutions.',
    contactEmail: 'cloud-hackathon@google.com'
  },
  {
    id: 'hack-3',
    name: 'NASA Space Apps Challenge',
    hackathonName: 'NASA Space Apps Challenge',
    description: 'International hackathon focused on solving real-world problems using NASA\'s open data. Build solutions for space exploration and Earth science.',
    projectDomain: 'Space Technology & Data Science',
    projectName: 'Space Innovation',
    hackathonUrl: 'https://www.spaceappschallenge.org',
    numberOfMembers: 0,
    members: [],
    createdAt: new Date().toISOString(),
    messages: [],
    deadlines: [
      {
        id: 'dl-4',
        title: 'Team Formation',
        date: '2025-10-25',
        priority: 'normal',
        createdAt: new Date().toISOString()
      },
      {
        id: 'dl-5',
        title: 'Project Submission',
        date: '2025-11-10',
        priority: 'high',
        createdAt: new Date().toISOString()
      }
    ],
    communityGuidelines: 'Use NASA open data ethically, collaborate globally, and innovate for humanity.',
    contactEmail: 'info@spaceapps.nasa.gov'
  },
  {
    id: 'hack-4',
    name: 'HackMIT 2025',
    hackathonName: 'HackMIT',
    description: 'MIT\'s annual hackathon bringing together the brightest minds to build innovative technology solutions across various domains.',
    projectDomain: 'General Technology',
    projectName: 'Tech Innovation',
    hackathonUrl: 'https://hackmit.org',
    numberOfMembers: 0,
    members: [],
    createdAt: new Date().toISOString(),
    messages: [],
    deadlines: [
      {
        id: 'dl-6',
        title: 'Application Deadline',
        date: '2025-10-20',
        priority: 'urgent',
        createdAt: new Date().toISOString()
      },
      {
        id: 'dl-7',
        title: 'Hackathon Weekend',
        date: '2025-11-08',
        priority: 'high',
        createdAt: new Date().toISOString()
      }
    ],
    communityGuidelines: 'Be respectful, creative, and push the boundaries of innovation.',
    contactEmail: 'team@hackmit.org'
  },
  {
    id: 'hack-5',
    name: 'TreeHacks Stanford',
    hackathonName: 'TreeHacks',
    description: 'Stanford University\'s premier hackathon focused on using technology to make a positive impact on the world.',
    projectDomain: 'Social Impact & Technology',
    projectName: 'Impact Projects',
    hackathonUrl: 'https://www.treehacks.com',
    numberOfMembers: 0,
    members: [],
    createdAt: new Date().toISOString(),
    messages: [],
    deadlines: [
      {
        id: 'dl-8',
        title: 'Early Registration',
        date: '2025-10-30',
        priority: 'normal',
        createdAt: new Date().toISOString()
      },
      {
        id: 'dl-9',
        title: 'Project Demo Day',
        date: '2025-11-20',
        priority: 'high',
        createdAt: new Date().toISOString()
      }
    ],
    communityGuidelines: 'Build for good, collaborate openly, and create meaningful solutions.',
    contactEmail: 'hello@treehacks.com'
  },
  {
    id: 'hack-6',
    name: 'ETHGlobal Hackathon',
    hackathonName: 'ETHGlobal',
    description: 'The world\'s largest Ethereum hackathon series, focused on building decentralized applications and blockchain innovations.',
    projectDomain: 'Blockchain & Web3',
    projectName: 'DApp Development',
    hackathonUrl: 'https://ethglobal.com',
    numberOfMembers: 0,
    members: [],
    createdAt: new Date().toISOString(),
    messages: [],
    deadlines: [
      {
        id: 'dl-10',
        title: 'Registration Opens',
        date: '2025-10-22',
        priority: 'normal',
        createdAt: new Date().toISOString()
      },
      {
        id: 'dl-11',
        title: 'Submission Deadline',
        date: '2025-11-18',
        priority: 'high',
        createdAt: new Date().toISOString()
      }
    ],
    communityGuidelines: 'Build decentralized, respect the community, and innovate in Web3.',
    contactEmail: 'support@ethglobal.com'
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sampleHackathons;
}

// Instructions for loading data:
console.log(`
========================================
Sample Hackathon Data Loaded!
========================================

To populate your app with these hackathons:

1. Open Browser Console (F12)
2. Run this command:

   localStorage.setItem('communities', JSON.stringify(${JSON.stringify(sampleHackathons)}))

3. Refresh the page

These hackathons include:
- MLH Hackathon 2025
- Google Cloud Hackathon
- NASA Space Apps Challenge
- HackMIT 2025
- TreeHacks Stanford
- ETHGlobal Hackathon

When you enroll in any of these, the AI backend will:
✓ Search for official hackathon information
✓ Analyze technologies and tools required
✓ Generate timelines and deadlines
✓ Suggest reference projects
✓ Provide tool guides and tips

========================================
`);
