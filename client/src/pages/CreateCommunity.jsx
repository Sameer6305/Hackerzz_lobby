import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import { Plus, Search, Sparkles } from 'lucide-react';

export default function CreateCommunity() {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [loadingH, setLoadingH] = useState(true);
  const [search, setSearch] = useState('');
  const [showNewHackathon, setShowNewHackathon] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  // Community form
  const [communityName, setCommunityName] = useState('');
  const [communityDesc, setCommunityDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // New hackathon form
  const [hForm, setHForm] = useState({
    name: '', description: '', domain: '', techStack: '', website: '',
    startDate: '', endDate: '',
  });
  const [creatingH, setCreatingH] = useState(false);

  useEffect(() => {
    api.get('/hackathons', { search })
      .then((res) => setHackathons(res.data.hackathons))
      .catch(console.error)
      .finally(() => setLoadingH(false));
  }, [search]);

  const handleCreateHackathon = async (e) => {
    e.preventDefault();
    setCreatingH(true);
    try {
      const res = await api.post('/hackathons', {
        ...hForm,
        techStack: hForm.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setHackathons([res.data.hackathon, ...hackathons]);
      setSelectedHackathon(res.data.hackathon);
      setShowNewHackathon(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingH(false);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!selectedHackathon) { setError('Please select a hackathon'); return; }
    setCreating(true);
    setError('');
    try {
      const res = await api.post('/communities', {
        name: communityName,
        description: communityDesc,
        hackathonId: selectedHackathon.id,
      });
      navigate(`/community/${res.data.community.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dark-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-dark-900 mb-1">Create a Community</h1>
          <p className="text-dark-500 text-sm mb-8">Set up a team space for your hackathon</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleCreateCommunity} className="space-y-6">
            <Input label="Community Name" value={communityName} onChange={(e) => setCommunityName(e.target.value)} placeholder="DeFi Builders" required />
            <Input label="Description (optional)" value={communityDesc} onChange={(e) => setCommunityDesc(e.target.value)} placeholder="Brief description of your team" />

            {/* Hackathon Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Select Hackathon</label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-200 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm"
                    placeholder="Search hackathons..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="button" variant="outline" onClick={() => setShowNewHackathon(true)}>
                  <Plus size={16} className="mr-1" /> New
                </Button>
              </div>

              {loadingH ? <Loader size="sm" /> : (
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {hackathons.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setSelectedHackathon(h)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                        selectedHackathon?.id === h.id
                          ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-200'
                          : 'border-dark-200 hover:border-dark-300 hover:bg-dark-50'
                      }`}
                    >
                      <span className="font-medium text-dark-800">{h.name}</span>
                      <span className="text-xs text-dark-400 ml-2">{h.domain}</span>
                    </button>
                  ))}
                  {hackathons.length === 0 && (
                    <p className="text-sm text-dark-400 text-center py-4">
                      No hackathons found. Create one first!
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" loading={creating} className="w-full" size="lg">
              <Sparkles size={18} className="mr-2" />
              Create Community
            </Button>
          </form>
        </motion.div>
      </main>

      {/* New Hackathon Modal */}
      <Modal isOpen={showNewHackathon} onClose={() => setShowNewHackathon(false)} title="Add New Hackathon">
        <form onSubmit={handleCreateHackathon} className="space-y-4">
          <Input label="Hackathon Name" value={hForm.name} onChange={(e) => setHForm({ ...hForm, name: e.target.value })} placeholder="ETH Global 2025" required />
          <Input label="Description" value={hForm.description} onChange={(e) => setHForm({ ...hForm, description: e.target.value })} placeholder="Brief about hackathon..." required />
          <Input label="Domain" value={hForm.domain} onChange={(e) => setHForm({ ...hForm, domain: e.target.value })} placeholder="Blockchain, AI/ML, Web Dev" required />
          <Input label="Tech Stack (comma separated)" value={hForm.techStack} onChange={(e) => setHForm({ ...hForm, techStack: e.target.value })} placeholder="React, Solidity, Node.js" required />
          <Input label="Website (optional)" value={hForm.website} onChange={(e) => setHForm({ ...hForm, website: e.target.value })} placeholder="https://hackathon.com" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" value={hForm.startDate} onChange={(e) => setHForm({ ...hForm, startDate: e.target.value })} />
            <Input label="End Date" type="date" value={hForm.endDate} onChange={(e) => setHForm({ ...hForm, endDate: e.target.value })} />
          </div>
          <Button type="submit" loading={creatingH} className="w-full">Add Hackathon</Button>
        </form>
      </Modal>
    </div>
  );
}
