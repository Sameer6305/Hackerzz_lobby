import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Save, ArrowLeft, User, Mail, Code, Trophy, Github, Linkedin, Globe } from 'lucide-react';

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Rust', 'Go',
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express',
  'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS',
  'TailwindCSS', 'GraphQL', 'REST API', 'Git', 'CI/CD',
  'Machine Learning', 'NLP', 'Computer Vision', 'Blockchain', 'Solidity',
  'Flutter', 'React Native', 'Swift', 'Kotlin',
];

const INTEREST_OPTIONS = [
  'Web Development', 'Mobile Development', 'AI/ML', 'Data Science',
  'Blockchain', 'Cloud Computing', 'DevOps', 'Cybersecurity',
  'IoT', 'AR/VR', 'Game Development', 'Open Source',
  'Competitive Programming', 'System Design', 'UI/UX Design',
];

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const profileExtras = JSON.parse(localStorage.getItem('profileExtras') || '{}');

  const [form, setForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    github: profileExtras.github || '',
    linkedin: profileExtras.linkedin || '',
    portfolio: profileExtras.portfolio || '',
    college: profileExtras.college || '',
    phone: profileExtras.phone || '',
  });

  const [selectedSkills, setSelectedSkills] = useState(profileExtras.skills || []);
  const [selectedInterests, setSelectedInterests] = useState(profileExtras.interests || []);

  const toggleItem = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Update backend profile
      await updateProfile({ username: form.username, bio: form.bio });

      // Save extended profile data to localStorage
      localStorage.setItem('profileExtras', JSON.stringify({
        ...profileExtras,
        skills: selectedSkills,
        interests: selectedInterests,
        github: form.github,
        linkedin: form.linkedin,
        portfolio: form.portfolio,
        college: form.college,
        phone: form.phone,
      }));

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/profile')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e2231] transition">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
              <p className="text-gray-500 text-sm">Update your personal information</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">{success}</div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-indigo-400" /> Personal Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-gray-500 text-sm cursor-not-allowed"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">College</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={form.college}
                    onChange={(e) => setForm({ ...form, college: e.target.value })}
                    placeholder="Your college or university"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe size={18} className="text-cyan-400" /> Social Links
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Github size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={form.portfolio}
                    onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code size={18} className="text-green-400" /> Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleItem(selectedSkills, setSelectedSkills, skill)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      selectedSkills.includes(skill)
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                        : 'bg-[#1e2231] text-gray-400 border border-[#2a2f3f] hover:border-gray-500'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" /> Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleItem(selectedInterests, setSelectedInterests, interest)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      selectedInterests.includes(interest)
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-[#1e2231] text-gray-400 border border-[#2a2f3f] hover:border-gray-500'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/profile')} className="text-gray-400">
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
