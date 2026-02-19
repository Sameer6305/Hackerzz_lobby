import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  Plus, Users, MessageSquare, ArrowRight, Trophy, Clock,
  FolderGit2, TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/communities')
      .then((res) => setCommunities(res.data.communities))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalMembers = communities.reduce((sum, c) => sum + (c._count?.members || 0), 0);
  const totalMessages = communities.reduce((sum, c) => sum + (c._count?.messages || 0), 0);
  const adminCount = communities.filter(c => c.role === 'ADMIN').length;

  const stats = [
    { label: 'Communities', value: communities.length, icon: Users, color: 'from-indigo-500 to-blue-600' },
    { label: 'Teams Led', value: adminCount, icon: Trophy, color: 'from-amber-500 to-orange-600' },
    { label: 'Total Members', value: totalMembers, icon: TrendingUp, color: 'from-emerald-500 to-green-600' },
    { label: 'Messages', value: totalMessages, icon: MessageSquare, color: 'from-rose-500 to-orange-500' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-heading">
                Welcome back, <span className="text-primary-400">{user?.username}</span>
              </h1>
              <p className="text-hint text-sm mt-1">
                {communities.length > 0
                  ? `You're part of ${communities.length} communit${communities.length === 1 ? 'y' : 'ies'}`
                  : 'Create or join a community to get started'}
              </p>
            </div>
            <Button onClick={() => navigate('/create-community')}>
              <Plus size={16} className="mr-2" /> Create Community
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="surface-card border border-theme rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon size={18} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-heading">{stat.value}</p>
                  <p className="text-xs text-hint mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Communities */}
          <h2 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
            <FolderGit2 size={18} className="text-indigo-400" /> Your Communities
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : communities.length === 0 ? (
            <div className="surface-card border border-theme rounded-xl p-12 text-center">
              <Users size={40} className="text-gray-600 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-heading mb-2">No communities yet</h2>
              <p className="text-hint text-sm mb-6 max-w-md mx-auto">Create your first hackathon community and start collaborating.</p>
              <Button onClick={() => navigate('/create-community')}>
                <Plus size={16} className="mr-2" /> Create Your First Community
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link to={`/community/${c.id}`}>
                    <div className="surface-card border border-theme rounded-xl p-5 hover:border-indigo-500/30 transition-all cursor-pointer group h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{c.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <Badge variant={c.role === 'ADMIN' ? 'primary' : 'default'}>{c.role}</Badge>
                      </div>
                      <h3 className="text-base font-semibold text-heading group-hover:text-indigo-400 transition mb-1">{c.name}</h3>
                      <p className="text-xs text-hint mb-2">{c.hackathon?.name}</p>
                      {c.hackathon?.domain && <Badge variant="success" className="mb-3">{c.hackathon.domain}</Badge>}
                      <div className="flex items-center gap-4 text-xs text-hint pt-3 border-t border-theme">
                        <span className="flex items-center gap-1"><Users size={12} /> {c._count?.members || 0}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={12} /> {c._count?.messages || 0}</span>
                        <ArrowRight size={12} className="ml-auto text-gray-600 group-hover:text-indigo-400 transition" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
