import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Badge from '../components/ui/Badge';
import { Clock, AlertTriangle, CheckCircle, Calendar, ArrowRight } from 'lucide-react';

export default function Deadlines() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/communities');
        const comms = res.data?.communities || [];
        // Fetch full details for each community to get deadlines
        const detailed = await Promise.all(
          comms.map(async (c) => {
            try {
              const detail = await api.get(`/communities/${c.id}`);
              return { ...c, deadlines: detail.data?.community?.deadlines || [] };
            } catch {
              return { ...c, deadlines: [] };
            }
          })
        );
        setCommunities(detailed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Collect all deadlines with community info
  const allDeadlines = communities.flatMap((c) =>
    (c.deadlines || []).map((d) => ({
      ...d,
      communityName: c.name,
      communityId: c.id,
    }))
  );

  const now = new Date();
  const overdue = allDeadlines.filter(d => new Date(d.dueDate) < now && !d.isCompleted);
  const today = allDeadlines.filter(d => {
    const due = new Date(d.dueDate);
    return due.toDateString() === now.toDateString() && !d.isCompleted;
  });
  const upcoming = allDeadlines.filter(d => {
    const due = new Date(d.dueDate);
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return due > now && due <= weekLater && due.toDateString() !== now.toDateString();
  });
  const later = allDeadlines.filter(d => {
    const due = new Date(d.dueDate);
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return due > weekLater;
  });

  const sections = [
    { title: 'Overdue', items: overdue, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500' },
    { title: 'Today', items: today, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
    { title: 'This Week', items: upcoming, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
    { title: 'Later', items: later, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-500' },
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getTimeRemaining = (date) => {
    const diff = new Date(date) - now;
    if (diff < 0) return 'Overdue';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h left`;
    if (hours > 0) return `${hours}h left`;
    return `${Math.floor(diff / (1000 * 60))}m left`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clock size={24} className="text-indigo-400" /> All Deadlines
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="px-2.5 py-1 rounded-lg bg-[#151822] border border-[#1e2231]">
                {allDeadlines.length} total
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : allDeadlines.length === 0 ? (
            <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-12 text-center">
              <Clock size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No deadlines yet.</p>
              <p className="text-gray-600 text-xs mt-1">Create deadlines in your community pages.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sections.map((section) => {
                if (section.items.length === 0) return null;
                const Icon = section.icon;
                return (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded-lg ${section.bg}`}>
                        <Icon size={16} className={section.color} />
                      </div>
                      <h2 className={`text-sm font-semibold ${section.color}`}>
                        {section.title} ({section.items.length})
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((deadline, i) => (
                        <motion.div
                          key={deadline.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => navigate(`/community/${deadline.communityId}`)}
                          className="bg-[#151822] border border-[#1e2231] rounded-xl p-4 hover:border-[#2a2f3f] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${section.dot} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">{deadline.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">{deadline.communityName}</span>
                                <span className="text-xs text-gray-600">•</span>
                                <span className="text-xs text-gray-500">{formatDate(deadline.dueDate)}</span>
                              </div>
                            </div>
                            <span className={`text-xs font-medium ${section.color}`}>
                              {getTimeRemaining(deadline.dueDate)}
                            </span>
                            <ArrowRight size={14} className="text-gray-600 group-hover:text-indigo-400 transition" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
