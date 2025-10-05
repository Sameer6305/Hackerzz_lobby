import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function CommunityCreate() {
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
    contactEmail: '',
  });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!form.communityName || !form.hackathonName || !form.projectDomain || !form.projectName) {
      setFormError('Please fill all required fields.');
      return;
    }
    setFormError('');
    alert('Community Created!');
    navigate('/dashboard');
  }

  return (
    <div className="community-create-page">
      <h2 className="community-form-title">Create New Community</h2>
      <form onSubmit={handleFormSubmit} className="community-form">
        <label>Community Name*<input name="communityName" value={form.communityName} onChange={handleFormChange} required /></label>
        <label>Hackathon Name*<input name="hackathonName" value={form.hackathonName} onChange={handleFormChange} required /></label>
        <label>Project Domain*<input name="projectDomain" value={form.projectDomain} onChange={handleFormChange} required placeholder="e.g. Web, AI, Blockchain" /></label>
        <label>Project Name*<input name="projectName" value={form.projectName} onChange={handleFormChange} required /></label>
  <label>Number of Members<input name="numberOfMembers" type="number" min="1" value={form.numberOfMembers} onChange={handleFormChange} placeholder="e.g. 4" /></label>
  <label>Team Members (comma separated)<input name="teamMembers" value={form.teamMembers} onChange={handleFormChange} placeholder="e.g. Alice, Bob, Carol" /></label>
        <label>Hackathon URL (optional)<input name="hackathonUrl" value={form.hackathonUrl} onChange={handleFormChange} /></label>
        <label>Community Guidelines (optional)<textarea name="communityGuidelines" value={form.communityGuidelines} onChange={handleFormChange} /></label>
        <label>Project Description<textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Describe your project..." /></label>
        <label>Contact Email<input name="contactEmail" type="email" value={form.contactEmail} onChange={handleFormChange} placeholder="For notifications (optional)" /></label>
        {formError && <div className="form-error">{formError}</div>}
        <div className="form-actions">
          <button type="submit" className="stats-btn stats-btn-primary">Create</button>
          <button type="button" className="stats-btn" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
