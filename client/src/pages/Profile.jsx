import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { User, Mail, Edit3, Github, Linkedin, Globe, Code, Trophy, Users, MessageSquare, Calendar } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/communities')
      .then((res) => setCommunities(res.data?.communities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalMessages = communities.reduce((sum, c) => sum + (c._count?.messages || 0), 0);
  const totalDeadlines = communities.reduce((sum, c) => sum + (c.deadlines?.length || 0), 0);
  const adminCommunities = communities.filter(c => c.role === 'ADMIN').length;

  const stats = [
    { label: 'Communities', value: communities.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Messages Sent', value: totalMessages, icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
    { label: 'Teams Led', value: adminCommunities, icon: Trophy, color: 'from-amber-500 to-orange-500' },
    { label: 'Active Hackathons', value: communities.length, icon: Calendar, color: 'from-purple-500 to-pink-500' },
  ];

  // Skills and interests (stored in localStorage for now, backend can be extended)
  const profileData = JSON.parse(localStorage.getItem('profileExtras') || '{}');
  const skills = profileData.skills || ['React', 'JavaScript', 'Node.js', 'Python'];
  const interests = profileData.interests || ['Web Development', 'AI/ML', 'Blockchain'];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          {/* Banner */}
          <div className="h-40 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCAyLjIxIDAtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          </div>

          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14 px-6">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center border-4 border-[#0f1117] shadow-xl">
              <span className="text-4xl font-bold text-white">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-white">{user?.username || 'User'}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                <Mail size={14} /> {user?.email || ''}
              </p>
              {user?.bio && <p className="text-gray-300 text-sm mt-2">{user.bio}</p>}
            </div>
            <Button variant="outline" onClick={() => navigate('/edit-profile')} className="border-gray-600 text-gray-300 hover:bg-[#1e2231]">
              <Edit3 size={16} className="mr-2" /> Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#151822] border border-[#1e2231] rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#151822] border border-[#1e2231] rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Code size={18} className="text-indigo-400" /> Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#151822] border border-[#1e2231] rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-amber-400" /> Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span key={interest} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm border border-amber-500/20">
                  {interest}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Communities List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#151822] border border-[#1e2231] rounded-xl p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-cyan-400" /> Your Communities
            </h3>
            {communities.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No communities joined yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {communities.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/community/${c.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#1e2231] hover:bg-[#252a3a] cursor-pointer transition"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{c.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.hackathon?.name || 'Hackathon'}</p>
                    </div>
                    <Badge variant={c.role === 'ADMIN' ? 'primary' : 'default'}>{c.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
