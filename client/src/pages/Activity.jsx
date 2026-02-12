import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  Briefcase, MapPin, Clock, DollarSign, ExternalLink,
  Building2, GraduationCap, ArrowRight, Search,
} from 'lucide-react';

const INTERNSHIPS = [
  {
    id: 1, company: 'Google', role: 'SWE Intern', location: 'Bangalore, India',
    stipend: '₹80,000/month', duration: '3 months', type: 'On-site',
    skills: ['Python', 'Data Structures', 'System Design'],
    logo: '🟢', color: 'from-green-500 to-emerald-600',
  },
  {
    id: 2, company: 'Microsoft', role: 'SDE Intern', location: 'Hyderabad, India',
    stipend: '₹75,000/month', duration: '2 months', type: 'Hybrid',
    skills: ['C++', 'Azure', 'Algorithms'],
    logo: '🔵', color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 3, company: 'Meta', role: 'Frontend Intern', location: 'Remote',
    stipend: '$8,000/month', duration: '3 months', type: 'Remote',
    skills: ['React', 'JavaScript', 'GraphQL'],
    logo: '🔵', color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 4, company: 'Amazon', role: 'Backend Intern', location: 'Bangalore, India',
    stipend: '₹60,000/month', duration: '6 months', type: 'On-site',
    skills: ['Java', 'AWS', 'Microservices'],
    logo: '🟠', color: 'from-orange-500 to-amber-600',
  },
  {
    id: 5, company: 'Netflix', role: 'Data Engineering Intern', location: 'Remote',
    stipend: '$9,000/month', duration: '3 months', type: 'Remote',
    skills: ['Python', 'Spark', 'Kafka'],
    logo: '🔴', color: 'from-red-500 to-rose-600',
  },
];

const JOBS = [
  {
    id: 1, company: 'Stripe', role: 'Full Stack Developer', location: 'Remote',
    salary: '$120K - $180K/year', experience: '2+ years', type: 'Full-time',
    skills: ['React', 'Ruby', 'PostgreSQL'],
    logo: '🟣', color: 'from-purple-500 to-violet-600',
  },
  {
    id: 2, company: 'Shopify', role: 'Backend Engineer', location: 'Remote',
    salary: '$100K - $150K/year', experience: '1+ years', type: 'Full-time',
    skills: ['Node.js', 'GraphQL', 'Redis'],
    logo: '🟢', color: 'from-green-600 to-teal-600',
  },
  {
    id: 3, company: 'Atlassian', role: 'Frontend Developer', location: 'Bangalore, India',
    salary: '₹18L - ₹30L/year', experience: '2+ years', type: 'Hybrid',
    skills: ['React', 'TypeScript', 'Jira'],
    logo: '🔵', color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 4, company: 'GitLab', role: 'DevOps Engineer', location: 'Remote',
    salary: '$110K - $160K/year', experience: '3+ years', type: 'Remote',
    skills: ['Kubernetes', 'Docker', 'CI/CD'],
    logo: '🟠', color: 'from-orange-600 to-red-600',
  },
  {
    id: 5, company: 'Discord', role: 'Systems Engineer', location: 'San Francisco, USA',
    salary: '$130K - $190K/year', experience: '3+ years', type: 'On-site',
    skills: ['Rust', 'Elixir', 'WebSocket'],
    logo: '🟣', color: 'from-indigo-500 to-purple-600',
  },
];

export default function Activity() {
  const [activeTab, setActiveTab] = useState('internships');
  const [search, setSearch] = useState('');

  const items = activeTab === 'internships' ? INTERNSHIPS : JOBS;
  const filtered = items.filter(item =>
    item.company.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase()) ||
    item.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase size={24} className="text-indigo-400" /> Activity
          </h1>

          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex gap-1 bg-[#151822] rounded-xl p-1 border border-[#1e2231]">
              <button
                onClick={() => setActiveTab('internships')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${activeTab === 'internships' ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
              >
                <GraduationCap size={16} /> Internships
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${activeTab === 'jobs' ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Building2 size={16} /> Jobs
              </button>
            </div>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151822] border border-[#1e2231] text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder={`Search ${activeTab}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Listings */}
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#151822] border border-[#1e2231] rounded-xl p-5 hover:border-[#2a2f3f] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 text-xl`}>
                    {item.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition">
                          {item.role}
                        </h3>
                        <p className="text-sm text-gray-400 mt-0.5">{item.company}</p>
                      </div>
                      <Badge variant={item.type === 'Remote' ? 'success' : item.type === 'Hybrid' ? 'warning' : 'default'}>
                        {item.type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} /> {item.stipend || item.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {item.duration || item.experience}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.skills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-[#1e2231] text-gray-400 text-[11px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-12 text-center">
                <Search size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No results found for "{search}"</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
