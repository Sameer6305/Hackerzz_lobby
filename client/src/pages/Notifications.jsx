import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Badge from '../components/ui/Badge';
import { Bell, MessageSquare, Trophy, Clock, ExternalLink, Newspaper } from 'lucide-react';

const TECH_NEWS = [
  {
    id: 1,
    title: 'GitHub Copilot Now Available for Free',
    source: 'GitHub Blog',
    time: '2 hours ago',
    category: 'AI',
    url: '#',
  },
  {
    id: 2,
    title: 'React 19 Stable Release: What You Need to Know',
    source: 'React Blog',
    time: '5 hours ago',
    category: 'Frontend',
    url: '#',
  },
  {
    id: 3,
    title: 'Next.js 15 Introduces Revolutionary Server Actions',
    source: 'Vercel',
    time: '1 day ago',
    category: 'Framework',
    url: '#',
  },
  {
    id: 4,
    title: 'PostgreSQL 17 Released with Major Performance Improvements',
    source: 'PostgreSQL',
    time: '2 days ago',
    category: 'Database',
    url: '#',
  },
  {
    id: 5,
    title: 'MLH Season 2025-2026 Hackathon Schedule Released',
    source: 'Major League Hacking',
    time: '3 days ago',
    category: 'Hackathon',
    url: '#',
  },
  {
    id: 6,
    title: 'Deno 2.0 Launches with Full Node.js Compatibility',
    source: 'Deno Blog',
    time: '4 days ago',
    category: 'Runtime',
    url: '#',
  },
  {
    id: 7,
    title: 'Bun 1.2 Adds Windows Support and Better Performance',
    source: 'Bun Blog',
    time: '5 days ago',
    category: 'Runtime',
    url: '#',
  },
  {
    id: 8,
    title: 'TailwindCSS 4.0 Alpha: Lightning CSS Engine',
    source: 'Tailwind Labs',
    time: '1 week ago',
    category: 'CSS',
    url: '#',
  },
];

export default function Notifications() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    api.get('/communities')
      .then((res) => setCommunities(res.data?.communities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const communityNotifications = communities.map(c => ({
    id: c.id,
    community: c.name,
    message: `${c._count?.messages || 0} messages`,
    members: c._count?.members || 0,
    role: c.role,
  }));

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Bell size={24} className="text-indigo-400" /> Notifications
          </h1>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[#151822] rounded-xl p-1 border border-[#1e2231]">
            {['news', 'community'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-all flex-1 justify-center
                  ${activeTab === tab
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab === 'news' ? <Newspaper size={16} /> : <MessageSquare size={16} />}
                {tab === 'news' ? 'Tech News' : 'Community Updates'}
              </button>
            ))}
          </div>

          {/* News Feed */}
          {activeTab === 'news' && (
            <div className="space-y-3">
              {TECH_NEWS.map((news, i) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#151822] border border-[#1e2231] rounded-xl p-4 hover:border-[#2a2f3f] transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600/10 flex items-center justify-center flex-shrink-0">
                      <Newspaper size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white group-hover:text-indigo-400 transition">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">{news.source}</span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500">{news.time}</span>
                      </div>
                    </div>
                    <Badge variant="primary">{news.category}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Community Updates */}
          {activeTab === 'community' && (
            <div className="space-y-3">
              {communityNotifications.length === 0 ? (
                <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-12 text-center">
                  <MessageSquare size={40} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No community updates yet.</p>
                  <p className="text-gray-600 text-xs mt-1">Join a community to see updates here.</p>
                </div>
              ) : (
                communityNotifications.map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#151822] border border-[#1e2231] rounded-xl p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">{notif.community[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{notif.community}</p>
                        <p className="text-xs text-gray-500">{notif.message} • {notif.members} members</p>
                      </div>
                      <Badge variant={notif.role === 'ADMIN' ? 'primary' : 'default'}>{notif.role}</Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
