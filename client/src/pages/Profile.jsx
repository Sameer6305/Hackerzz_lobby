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
  const adminCommunities = communities.filter(c => c.role === 'ADMIN').length;
  const uniqueHackathons = new Set(communities.map(c => c.community?.hackathonId || c.hackathonId)).size;

  const stats = [
    { label: 'Communities', value: communities.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Messages Sent', value: totalMessages, icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
    { label: 'Teams Led', value: adminCommunities, icon: Trophy, color: 'from-amber-500 to-orange-500' },
    { label: 'Active Hackathons', value: uniqueHackathons, icon: Calendar, color: 'from-rose-500 to-red-500' },
  ];

  // Skills and interests (stored in localStorage for now, backend can be extended)
  const profileData = JSON.parse(localStorage.getItem('profileExtras') || '{}');
  const skills = profileData.skills || ['React', 'JavaScript', 'Node.js', 'Python'];
  const interests = profileData.interests || ['Web Development', 'AI/ML', 'Blockchain'];
  const socialLinks = [
    profileData.github && { icon: Github, label: 'GitHub', url: profileData.github },
    profileData.linkedin && { icon: Linkedin, label: 'LinkedIn', url: profileData.linkedin },
    profileData.portfolio && { icon: Globe, label: 'Portfolio', url: profileData.portfolio },
  ].filter(Boolean);

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
          <div className="h-40 rounded-2xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
          </div>

          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 relative z-10 -mt-14 px-6">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center border-4 shadow-xl" style={{ borderColor: 'var(--surface-base)' }}>
              <span className="text-4xl font-bold text-white">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-heading">{user?.username || 'User'}</h1>
              <p className="text-label text-sm flex items-center gap-2 mt-1">
                <Mail size={14} /> {user?.email || ''}
              </p>
              {profileData.college && (
                <p className="text-hint text-sm mt-1">{profileData.college}</p>
              )}
              {user?.bio && <p className="text-body text-sm mt-2">{user.bio}</p>}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 mt-3">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-400 transition"
                        title={link.label}
                      >
                        <Icon size={16} />
                        <span className="hidden sm:inline">{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            <Button variant="outline" onClick={() => navigate('/edit-profile')} className="border-theme-secondary text-body hover:surface-hover">
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
                className="surface-card border border-theme rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-heading">{stat.value}</p>
                <p className="text-xs text-hint mt-1">{stat.label}</p>
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
            className="surface-card border border-theme rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
              <Code size={18} className="text-primary-500" /> Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 text-sm border border-primary-500/20">
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
            className="surface-card border border-theme rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
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
            className="surface-card border border-theme rounded-xl p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
              <Users size={18} className="text-cyan-400" /> Your Communities
            </h3>
            {communities.length === 0 ? (
              <p className="text-hint text-sm text-center py-8">No communities joined yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {communities.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/community/${c.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg surface-elevated hover:bg-[var(--surface-hover)] cursor-pointer transition"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{c.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">{c.name}</p>
                      <p className="text-xs text-hint">{c.hackathon?.name || 'Hackathon'}</p>
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
