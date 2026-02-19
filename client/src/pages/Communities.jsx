import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  Users, Search, Plus, ArrowRight, MessageSquare, Crown,
  Globe, Code, Cpu, Palette, Trophy,
} from 'lucide-react';

const TOPICS = [
  { name: 'Web Dev', icon: Globe, color: 'from-blue-500 to-cyan-500' },
  { name: 'AI/ML', icon: Cpu, color: 'from-rose-500 to-red-500' },
  { name: 'Blockchain', icon: Code, color: 'from-amber-500 to-orange-500' },
  { name: 'Mobile', icon: Palette, color: 'from-green-500 to-emerald-500' },
  { name: 'DevOps', icon: Code, color: 'from-red-500 to-rose-500' },
  { name: 'Data Science', icon: Cpu, color: 'from-indigo-500 to-violet-500' },
];

export default function Communities() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    api.get('/communities')
      .then((res) => setCommunities(res.data?.communities || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = communities.filter(c => {
    const matchSearch = !search || 
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.hackathon?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.hackathon?.domain?.toLowerCase().includes(search.toLowerCase());
    const matchTopic = !selectedTopic ||
      c.hackathon?.domain?.toLowerCase().includes(selectedTopic.toLowerCase());
    return matchSearch && matchTopic;
  });

  const adminCommunities = filtered.filter(c => c.role === 'ADMIN');
  const memberCommunities = filtered.filter(c => c.role === 'MEMBER');

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-heading flex items-center gap-3">
              <Users size={24} className="text-indigo-400" /> Communities
            </h1>
            <Button onClick={() => navigate('/create-community')}>
              <Plus size={16} className="mr-2" /> Create Community
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hint" />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl surface-card border border-theme text-heading text-sm placeholder:text-hint focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="Search communities by name, hackathon, or domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Explore by Topic */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-label uppercase tracking-wider mb-3">Explore by Topic</h3>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => {
                const Icon = topic.icon;
                const isActive = selectedTopic === topic.name;
                return (
                  <button
                    key={topic.name}
                    onClick={() => setSelectedTopic(isActive ? null : topic.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                        : 'surface-card text-label border border-theme hover:border-theme-secondary'
                      }`}
                  >
                    <Icon size={14} /> {topic.name}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[var(--border-secondary)] border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="surface-card border border-theme rounded-xl p-12 text-center">
              <Users size={40} className="text-hint mx-auto mb-3" />
              <p className="text-label text-sm">No communities found.</p>
              <Button onClick={() => navigate('/create-community')} className="mt-4">
                <Plus size={16} className="mr-2" /> Create One
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Admin Communities */}
              {adminCommunities.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Crown size={14} /> Your Communities
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminCommunities.map((c, i) => (
                      <CommunityCard key={c.id} community={c} index={i} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}

              {/* Member Communities */}
              {memberCommunities.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-label uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users size={14} /> Joined Communities
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {memberCommunities.map((c, i) => (
                      <CommunityCard key={c.id} community={c} index={i} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

function CommunityCard({ community: c, index, navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/community/${c.id}`)}
      className="surface-card border border-theme rounded-xl p-5 hover:border-indigo-500/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{c.name?.[0]?.toUpperCase()}</span>
        </div>
        <Badge variant={c.role === 'ADMIN' ? 'primary' : 'default'}>{c.role}</Badge>
      </div>
      <h3 className="text-base font-semibold text-heading group-hover:text-indigo-400 transition mb-1">
        {c.name}
      </h3>
      <p className="text-xs text-hint mb-3">{c.hackathon?.name}</p>
      {c.hackathon?.domain && (
        <Badge variant="success" className="mb-3">{c.hackathon.domain}</Badge>
      )}
      <div className="flex items-center gap-4 text-xs text-hint pt-3 border-t border-theme">
        <span className="flex items-center gap-1"><Users size={12} /> {c._count?.members || 0}</span>
        <span className="flex items-center gap-1"><MessageSquare size={12} /> {c._count?.messages || 0}</span>
        <ArrowRight size={12} className="ml-auto text-hint group-hover:text-indigo-400 transition" />
      </div>
    </motion.div>
  );
}
