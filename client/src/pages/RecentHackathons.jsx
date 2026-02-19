import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  Trophy, Calendar, Globe, Users, ChevronRight,
  ExternalLink, Search, Clock, MapPin, Code,
} from 'lucide-react';

export default function RecentHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/hackathons')
      .then((res) => {
        const h = res.data?.hackathons || [];
        setHackathons(h);
        if (h.length > 0) setSelected(h[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = hackathons.filter(h =>
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.domain?.toLowerCase().includes(search.toLowerCase()) ||
    h.description?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatus = (hackathon) => {
    const now = new Date();
    if (hackathon.endDate && new Date(hackathon.endDate) < now) return { label: 'Ended', variant: 'default' };
    if (hackathon.startDate && new Date(hackathon.startDate) <= now) return { label: 'Active', variant: 'success' };
    return { label: 'Upcoming', variant: 'warning' };
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-heading mb-6 flex items-center gap-3">
            <Trophy size={24} className="text-amber-400" /> Hackathons
          </h1>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hint" />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl surface-card border border-theme text-heading text-sm placeholder:text-hint focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="Search hackathons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[var(--border-secondary)] border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : hackathons.length === 0 ? (
            <div className="surface-card border border-theme rounded-xl p-12 text-center">
              <Trophy size={40} className="text-hint mx-auto mb-3" />
              <p className="text-label text-sm">No hackathons found.</p>
              <p className="text-hint text-xs mt-1">Create a community to add hackathon information.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Hackathon List */}
              <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                {filtered.map((h, i) => {
                  const status = getStatus(h);
                  const isSelected = selected?.id === h.id;
                  return (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelected(h)}
                      className={`rounded-xl p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/15 border border-indigo-500/40'
                          : 'surface-card border border-theme hover:border-theme-secondary'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-sm font-semibold ${isSelected ? 'text-primary-400' : 'text-heading'}`}>
                          {h.name}
                        </h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-xs text-hint line-clamp-2 mb-2">{h.description}</p>
                      <div className="flex items-center gap-3 text-xs text-hint">
                        <span className="flex items-center gap-1"><Code size={10} /> {h.domain}</span>
                        {h.startDate && (
                          <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(h.startDate)}</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-hint text-sm text-center py-8">No hackathons match your search.</p>
                )}
              </div>

              {/* Detail View */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="surface-card border border-theme rounded-xl p-6 sticky top-24"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-heading mb-1">{selected.name}</h2>
                          <Badge variant={getStatus(selected).variant}>{getStatus(selected).label}</Badge>
                        </div>
                        {selected.website && (
                          <a
                            href={selected.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition"
                          >
                            Visit <ExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      <p className="text-body text-sm leading-relaxed mb-6">{selected.description}</p>

                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl surface-elevated">
                          <p className="text-xs text-hint uppercase font-medium mb-1">Domain</p>
                          <p className="text-sm font-medium text-heading">{selected.domain}</p>
                        </div>
                        <div className="p-4 rounded-xl surface-elevated">
                          <p className="text-xs text-hint uppercase font-medium mb-1">Communities</p>
                          <p className="text-sm font-medium text-heading">{selected._count?.communities || 0} teams</p>
                        </div>
                        {selected.startDate && (
                          <div className="p-4 rounded-xl surface-elevated">
                            <p className="text-xs text-hint uppercase font-medium mb-1">Start Date</p>
                            <p className="text-sm font-medium text-heading">{formatDate(selected.startDate)}</p>
                          </div>
                        )}
                        {selected.endDate && (
                          <div className="p-4 rounded-xl surface-elevated">
                            <p className="text-xs text-hint uppercase font-medium mb-1">End Date</p>
                            <p className="text-sm font-medium text-heading">{formatDate(selected.endDate)}</p>
                          </div>
                        )}
                      </div>

                      {selected.techStack?.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs text-hint uppercase font-medium mb-2">Tech Stack</p>
                          <div className="flex flex-wrap gap-2">
                            {selected.techStack.map((tech) => (
                              <span key={tech} className="px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 text-sm border border-primary-500/20">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selected.keywords?.length > 0 && (
                        <div>
                          <p className="text-xs text-hint uppercase font-medium mb-2">Keywords</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selected.keywords.map((kw) => (
                              <span key={kw} className="px-2 py-0.5 rounded-md surface-elevated text-label text-xs">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="surface-card border border-theme rounded-xl p-12 text-center">
                      <Trophy size={40} className="text-hint mx-auto mb-3" />
                      <p className="text-label text-sm">Select a hackathon to view details</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
