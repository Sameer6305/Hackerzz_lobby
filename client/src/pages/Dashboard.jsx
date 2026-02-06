import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Badge from '../components/ui/Badge';
import { Plus, Users, MessageSquare, Calendar, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dark-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-dark-900">
              Welcome back, <span className="gradient-text">{user?.username}</span>
            </h1>
            <p className="text-dark-500 text-sm mt-1">
              {communities.length > 0
                ? `You're part of ${communities.length} communit${communities.length === 1 ? 'y' : 'ies'}`
                : 'Create or join a community to get started'}
            </p>
          </div>
          <Button onClick={() => navigate('/create-community')} className="group">
            <Plus size={18} className="mr-2" />
            Create Community
          </Button>
        </motion.div>

        {/* Content */}
        {loading ? (
          <Loader text="Loading your communities..." />
        ) : communities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users size={36} className="text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-dark-800 mb-2">No communities yet</h2>
            <p className="text-dark-500 mb-6 max-w-md mx-auto">
              Create your first hackathon community and start collaborating with your team.
            </p>
            <Button onClick={() => navigate('/create-community')}>
              <Plus size={18} className="mr-2" />
              Create Your First Community
            </Button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/community/${c.id}`}>
                  <Card className="group cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-dark-900 group-hover:text-primary-600 transition">
                          {c.name}
                        </h3>
                        <p className="text-sm text-dark-500 mt-0.5">{c.hackathon?.name}</p>
                      </div>
                      <Badge variant={c.role === 'ADMIN' ? 'primary' : 'default'}>
                        {c.role}
                      </Badge>
                    </div>

                    {c.hackathon?.domain && (
                      <Badge variant="success" className="mb-4">{c.hackathon.domain}</Badge>
                    )}

                    <div className="flex items-center gap-4 text-xs text-dark-400 mt-auto pt-4 border-t border-dark-100">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {c._count?.members || 0} members
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} /> {c._count?.messages || 0} messages
                      </span>
                      <ArrowRight size={14} className="ml-auto text-dark-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
