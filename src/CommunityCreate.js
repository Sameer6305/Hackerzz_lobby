import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { getUserProfile } from './utils/profileUtils';
import { addProject, joinCommunity } from './utils/userDataUtils';

export default function CommunityCreate() {
  const userProfile = getUserProfile();
  
  const [form, setForm] = useState({
    communityName: '',
    hackathonName: '',
    numberOfMembers: '',
    teamMembers: '',
    hackathonUrl: '',
    communityGuidelines: '',
    projectDomain: '',
    projectName: '',
    description: '',
    contactEmail: userProfile.email || '',
  });
  const [formError, setFormError] = useState('');
  const [showHackathonSuggestions, setShowHackathonSuggestions] = useState(false);
  const navigate = useNavigate();

  // Popular hackathon suggestions
  const hackathonSuggestions = [
    { name: 'MLH Hackathon 2025', description: 'Major League Hacking event' },
    { name: 'Google Cloud Hackathon', description: 'Cloud computing challenges' },
    { name: 'NASA Space Apps Challenge', description: 'Space technology innovation' },
    { name: 'HackMIT', description: 'MIT\'s premier hackathon' },
    { name: 'TreeHacks', description: 'Stanford hackathon' },
    { name: 'ETHGlobal', description: 'Ethereum blockchain hackathon' },
    { name: 'React Global Summit', description: 'React development competition' },
    { name: 'AI/ML Hackathon', description: 'Artificial Intelligence projects' },
  ];

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Show suggestions when user focuses on hackathon name field
    if (name === 'hackathonName') {
      setShowHackathonSuggestions(value.length === 0);
    }
  }

  function selectHackathonSuggestion(hackathonName) {
    setForm((prev) => ({ ...prev, hackathonName }));
    setShowHackathonSuggestions(false);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!form.communityName || !form.hackathonName || !form.projectDomain || !form.projectName) {
      setFormError('Please fill all required fields.');
      return;
    }
    setFormError('');
    
    // Create community object with unique ID and timestamp
    const newCommunity = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
      members: form.teamMembers ? form.teamMembers.split(',').map(m => m.trim()).filter(m => m) : [],
      messages: [],
      deadlines: [],
    };
    
    // Get existing communities from localStorage
    const existingCommunities = JSON.parse(localStorage.getItem('communities') || '[]');
    
    // Add new community
    existingCommunities.push(newCommunity);
    
    // Save to localStorage
    localStorage.setItem('communities', JSON.stringify(existingCommunities));
    
    // Dispatch custom event to notify other components
    console.log('Dispatching deadlinesUpdated event from community create');
    window.dispatchEvent(new CustomEvent('deadlinesUpdated', {
      detail: { communityId: newCommunity.id }
    }));
    
    // Add project to user's projects
    addProject({
      name: form.projectName,
      description: form.description || `${form.projectDomain} project for ${form.hackathonName}`,
      communityId: newCommunity.id,
      communityName: form.communityName,
      hackathonName: form.hackathonName,
      projectDomain: form.projectDomain,
      type: 'community-project'
    });
    
    // Auto-join the community creator
    joinCommunity(newCommunity);
    
    alert('Community Created Successfully! You have been added as a member.');
    navigate('/communities');
  }

  return (
    <div className="community-create-page">
      <h2 className="community-form-title">Create New Community</h2>
      <form onSubmit={handleFormSubmit} className="community-form">
        <div className="form-row">
          <label htmlFor="communityName">Community Name*</label>
          <input id="communityName" name="communityName" value={form.communityName} onChange={handleFormChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="hackathonName">Hackathon Name*</label>
          <div style={{ position: 'relative' }}>
            <input 
              id="hackathonName" 
              name="hackathonName" 
              value={form.hackathonName} 
              onChange={handleFormChange}
              onFocus={() => setShowHackathonSuggestions(form.hackathonName.length === 0)}
              onBlur={() => setTimeout(() => setShowHackathonSuggestions(false), 200)}
              required 
              placeholder="Type or select from suggestions..."
            />
            {showHackathonSuggestions && (
              <div className="hackathon-suggestions">
                <div className="suggestions-header">
                  <span className="ai-model-badge">🤖 AI Model Available</span>
                  <span className="suggestions-subtitle">Popular Hackathons with AI Analysis Support</span>
                </div>
                {hackathonSuggestions.map((hackathon, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => selectHackathonSuggestion(hackathon.name)}
                  >
                    <div className="suggestion-name">{hackathon.name}</div>
                    <div className="suggestion-description">{hackathon.description}</div>
                  </div>
                ))}
                <div className="suggestions-footer">
                  💡 These hackathons have AI-powered analysis models available
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="form-row">
          <label htmlFor="projectDomain">Project Domain*</label>
          <input id="projectDomain" name="projectDomain" value={form.projectDomain} onChange={handleFormChange} required placeholder="e.g. Web, AI, Blockchain" />
        </div>
        <div className="form-row">
          <label htmlFor="projectName">Project Name*</label>
          <input id="projectName" name="projectName" value={form.projectName} onChange={handleFormChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="numberOfMembers">Number of Members</label>
          <input id="numberOfMembers" name="numberOfMembers" type="number" min="1" value={form.numberOfMembers} onChange={handleFormChange} placeholder="e.g. 4" />
        </div>
        <div className="form-row">
          <label htmlFor="teamMembers">Team Members (comma separated)</label>
          <input id="teamMembers" name="teamMembers" value={form.teamMembers} onChange={handleFormChange} placeholder="e.g. Alice, Bob, Carol" />
        </div>

        <div className="form-row full">
          <label htmlFor="hackathonUrl">Hackathon URL (optional)</label>
          <input id="hackathonUrl" name="hackathonUrl" value={form.hackathonUrl} onChange={handleFormChange} />
        </div>

        <div className="form-row full">
          <label htmlFor="communityGuidelines">Community Guidelines (optional)</label>
          <textarea id="communityGuidelines" name="communityGuidelines" value={form.communityGuidelines} onChange={handleFormChange} />
        </div>

        <div className="form-row full">
          <label htmlFor="description">Project Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleFormChange} placeholder="Describe your project..." />
        </div>

        <div className="form-row">
          <label htmlFor="contactEmail">Contact Email</label>
          <input id="contactEmail" name="contactEmail" type="email" value={form.contactEmail} onChange={handleFormChange} placeholder="For notifications (optional)" />
        </div>

        {formError && <div className="form-error">{formError}</div>}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Community</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
