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
        <div className="form-row">
          <label htmlFor="communityName">Community Name*</label>
          <input id="communityName" name="communityName" value={form.communityName} onChange={handleFormChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="hackathonName">Hackathon Name*</label>
          <input id="hackathonName" name="hackathonName" value={form.hackathonName} onChange={handleFormChange} required />
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
