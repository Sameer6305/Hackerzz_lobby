import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import {
  MessageSquare, Info, Clock, Users, Github, Send, Plus,
  Star, GitFork, ExternalLink, ArrowLeft, UserPlus,
} from 'lucide-react';

const TABS = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'info', label: 'Information', icon: Info },
  { id: 'deadlines', label: 'Deadlines', icon: Clock },
  { id: 'members', label: 'Team', icon: Users },
  { id: 'github', label: 'GitHub', icon: Github },
];

export default function CommunityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [community, setCommunity] = useState(null);
  const [role, setRole] = useState('MEMBER');
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/communities/${id}`)
      .then((res) => {
        setCommunity(res.data.community);
        setRole(res.data.role);
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (!community) return null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition mb-3">
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{community.name}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {community.hackathon?.name} &middot; <Badge variant="success">{community.hackathon?.domain}</Badge>
              </p>
            </div>
            <Badge variant={role === 'ADMIN' ? 'primary' : 'default'}>{role}</Badge>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#151822] border border-[#1e2231] rounded-xl p-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${activeTab === tab.id
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-[#1e2231]'}`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'chat' && <ChatTab communityId={id} user={user} />}
            {activeTab === 'info' && <InfoTab hackathon={community.hackathon} />}
            {activeTab === 'deadlines' && <DeadlinesTab communityId={id} deadlines={community.deadlines} />}
            {activeTab === 'members' && <MembersTab communityId={id} members={community.members} role={role} />}
            {activeTab === 'github' && <GithubTab communityId={id} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

// ─── CHAT TAB ────────────────────────────────────────────
function ChatTab({ communityId, user }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const pollRef = useRef(null);

  const fetchMessages = useCallback(() => {
    api.get(`/communities/${communityId}/messages`).then((res) => {
      setMessages(res.data.messages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [communityId]);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3s
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    // Optimistic UI
    const optimistic = {
      id: `temp-${Date.now()}`,
      content: newMsg,
      user: { id: user.id, username: user.username, avatar: user.avatar },
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setNewMsg('');
    setSending(true);

    try {
      await api.post(`/communities/${communityId}/messages`, { content: newMsg });
      fetchMessages();
    } catch {
      // Remove optimistic message on failure and restore input
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setNewMsg(optimistic.content);
    }
    setSending(false);
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-gray-600 border-t-indigo-500 rounded-full animate-spin" /></div>;

  return (
    <div className="bg-[#151822] border border-[#1e2231] rounded-xl flex flex-col h-[65vh]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 pr-2">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-12">No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.user?.id === user.id;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">
                  {msg.user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className={`max-w-[70%] ${isMe ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-2 rounded-2xl text-sm
                  ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-[#1e2231] text-gray-200 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
                <p className="text-[11px] text-gray-500 mt-1 px-1">
                  {msg.user?.username} &middot; {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 p-4 pt-3 border-t border-[#1e2231]">
        <input
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit" disabled={!newMsg.trim() || sending} size="md">
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}

// ─── INFO TAB ────────────────────────────────────────────
function InfoTab({ hackathon }) {
  if (!hackathon) return <p className="text-gray-500">No hackathon info available.</p>;

  return (
    <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{hackathon.name}</h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">{hackathon.description}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#1e2231]">
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Domain</p>
          <p className="font-medium text-white">{hackathon.domain}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#1e2231]">
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Website</p>
          {hackathon.website ? (
            <a href={hackathon.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline text-sm">{hackathon.website}</a>
          ) : (
            <p className="text-gray-500 text-sm">Not provided</p>
          )}
        </div>
      </div>

      {hackathon.techStack?.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {hackathon.techStack.map((tech) => (
              <span key={tech} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20">{tech}</span>
            ))}
          </div>
        </div>
      )}

      {(hackathon.startDate || hackathon.endDate) && (
        <div className="mt-6 p-4 rounded-xl bg-[#1e2231] flex gap-8">
          {hackathon.startDate && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Starts</p>
              <p className="text-sm font-medium text-white">{new Date(hackathon.startDate).toLocaleDateString()}</p>
            </div>
          )}
          {hackathon.endDate && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Ends</p>
              <p className="text-sm font-medium text-white">{new Date(hackathon.endDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DEADLINES TAB ───────────────────────────────────────
function DeadlinesTab({ communityId, deadlines: initial }) {
  const [deadlines, setDeadlines] = useState(initial || []);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [creating, setCreating] = useState(false);

  const [deadlineError, setDeadlineError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setDeadlineError('');
    try {
      const res = await api.post(`/communities/${communityId}/deadlines`, form);
      setDeadlines([...deadlines, res.data.deadline].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
      setShowModal(false);
      setForm({ title: '', description: '', dueDate: '' });
    } catch (err) {
      setDeadlineError(err.message || 'Failed to create deadline');
    }
    setCreating(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Deadlines</h2>
        <Button size="sm" onClick={() => setShowModal(true)}><Plus size={14} className="mr-1" /> Add</Button>
      </div>

      {deadlines.length === 0 ? (
        <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-8">
          <p className="text-center text-gray-500 text-sm">No deadlines yet. Add one to keep your team on track.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deadlines.map((d) => {
            const isPast = new Date(d.dueDate) < new Date();
            return (
              <div key={d.id} className={`bg-[#151822] border border-[#1e2231] rounded-xl p-4 flex items-center gap-4 ${isPast ? 'opacity-60' : ''}`}>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isPast ? 'bg-gray-600' : 'bg-emerald-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{d.title}</p>
                  {d.description && <p className="text-xs text-gray-500 truncate">{d.description}</p>}
                </div>
                <Badge variant={isPast ? 'default' : 'warning'}>
                  {new Date(d.dueDate).toLocaleDateString()}
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Deadline">
        {deadlineError && <div className="mb-3 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm">{deadlineError}</div>}
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Due Date" type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <Button type="submit" loading={creating} className="w-full">Add Deadline</Button>
        </form>
      </Modal>
    </>
  );
}

// ─── MEMBERS TAB ─────────────────────────────────────────
function MembersTab({ communityId, members: initial, role }) {
  const [members, setMembers] = useState(initial || []);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      await api.post(`/communities/${communityId}/members`, { username });
      // Refresh community data
      const res = await api.get(`/communities/${communityId}`);
      setMembers(res.data.community.members);
      setShowModal(false);
      setUsername('');
    } catch (err) {
      setError(err.message);
    }
    setAdding(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Team Members ({members.length})</h2>
        {role === 'ADMIN' && (
          <Button size="sm" onClick={() => setShowModal(true)}><UserPlus size={14} className="mr-1" /> Invite</Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {members.map((m) => (
          <div key={m.id} className="bg-[#151822] border border-[#1e2231] rounded-xl flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{m.user?.username?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{m.user?.username}</p>
              <p className="text-xs text-gray-500">{m.user?.bio || 'No bio'}</p>
            </div>
            <Badge variant={m.role === 'ADMIN' ? 'primary' : 'default'}>{m.role}</Badge>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Invite Member">
        {error && <div className="mb-3 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
          <Button type="submit" loading={adding} className="w-full">Add Member</Button>
        </form>
      </Modal>
    </>
  );
}

// ─── GITHUB TAB (CRITICAL FEATURE) ──────────────────────
function GithubTab({ communityId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/communities/${communityId}/github-suggestions`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [communityId]);

  if (loading) return <Loader text="Fetching real-time GitHub suggestions..." />;
  if (error) return (
    <Card hover={false}>
      <p className="text-center text-red-500 text-sm py-8">{error}</p>
    </Card>
  );

  if (!data) return (
    <Card hover={false}>
      <p className="text-center text-gray-500 text-sm py-8">No data available.</p>
    </Card>
  );

  const { suggestions, meta } = data;

  return (
    <div>
      {/* Meta info */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#1e2231] to-[#151822] border border-[#1e2231] text-white">
        <div className="flex items-center gap-2 mb-2">
          <Github size={18} />
          <h3 className="font-semibold">Real-Time Project Suggestions</h3>
        </div>
        <p className="text-gray-400 text-sm mb-3">
          Based on domain: <strong>{meta?.domain}</strong> &middot;
          Tech: {meta?.techStack?.join(', ')} &middot;
          {meta?.totalFound?.toLocaleString()} repos found
        </p>
        {meta?.rateLimit && (
          <p className="text-xs text-dark-400">
            GitHub API calls remaining: {meta.rateLimit.remaining}
          </p>
        )}
      </div>

      {/* Repo Grid */}
      <div className="space-y-3">
        {suggestions.map((repo, i) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-4 hover:border-indigo-500/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 font-semibold text-sm hover:underline flex items-center gap-1"
                  >
                    {repo.name}
                    <ExternalLink size={12} />
                  </a>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{repo.description}</p>
                  {repo.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {repo.topics.slice(0, 5).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                    <Star size={12} /> {repo.stars?.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <GitFork size={12} /> {repo.forks?.toLocaleString()}
                  </span>
                  {repo.language && (
                    <Badge variant="default">{repo.language}</Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-8">
          <p className="text-center text-gray-500 text-sm">
            No GitHub suggestions available. Check hackathon tech stack.
          </p>
        </div>
      )}
    </div>
  );
}
