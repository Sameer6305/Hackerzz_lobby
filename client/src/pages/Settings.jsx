import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import {
  User, Bell, Shield, Palette, Info, Save, Moon, Sun,
  Eye, EyeOff, Volume2, VolumeX, Globe,
} from 'lucide-react';

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'about', label: 'About', icon: Info },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);

  const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  const [form, setForm] = useState({
    emailNotifications: settings.emailNotifications ?? true,
    pushNotifications: settings.pushNotifications ?? true,
    communityAlerts: settings.communityAlerts ?? true,
    deadlineReminders: settings.deadlineReminders ?? true,
    profileVisibility: settings.profileVisibility ?? 'public',
    showEmail: settings.showEmail ?? false,
    showActivity: settings.showActivity ?? true,
    theme: settings.theme ?? 'dark',
    language: settings.language ?? 'English',
    compactMode: settings.compactMode ?? false,
  });

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-[#2a2f3f]'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tabs */}
            <div className="lg:w-56 flex-shrink-0">
              <div className="bg-[#151822] border border-[#1e2231] rounded-xl p-2 flex lg:flex-col gap-1 overflow-x-auto">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all w-full
                        ${activeTab === tab.id
                          ? 'bg-indigo-600/20 text-indigo-400'
                          : 'text-gray-400 hover:text-white hover:bg-[#1e2231]'
                        }`}
                    >
                      <Icon size={16} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-[#151822] border border-[#1e2231] rounded-xl p-6">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
                      <input className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={user?.username || ''} disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                      <input className="w-full px-4 py-2.5 rounded-xl bg-[#1e2231] border border-[#2a2f3f] text-gray-500 text-sm cursor-not-allowed" value={user?.email || ''} disabled />
                    </div>
                    <div className="pt-4 border-t border-[#2a2f3f]">
                      <h4 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h4>
                      <Button variant="danger" onClick={logout} className="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                      { key: 'communityAlerts', label: 'Community Alerts', desc: 'New messages and member updates' },
                      { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'Get reminders before deadlines' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-[#1e2231] last:border-0">
                        <div>
                          <p className="text-sm font-medium text-white">{label}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                        <Toggle checked={form[key]} onChange={(val) => setForm({ ...form, [key]: val })} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
                      <div className="flex gap-2">
                        {['public', 'members', 'private'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setForm({ ...form, profileVisibility: opt })}
                            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                              form.profileVisibility === opt
                                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                                : 'bg-[#1e2231] text-gray-400 border border-[#2a2f3f]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    {[
                      { key: 'showEmail', label: 'Show Email', desc: 'Display email on your profile' },
                      { key: 'showActivity', label: 'Show Activity', desc: 'Show your activity status' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-[#1e2231] last:border-0">
                        <div>
                          <p className="text-sm font-medium text-white">{label}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                        <Toggle checked={form[key]} onChange={(val) => setForm({ ...form, [key]: val })} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                      <div className="flex gap-2">
                        {['dark', 'light', 'system'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setForm({ ...form, theme: t })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                              form.theme === t
                                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                                : 'bg-[#1e2231] text-gray-400 border border-[#2a2f3f]'
                            }`}
                          >
                            {t === 'dark' ? <Moon size={14} /> : t === 'light' ? <Sun size={14} /> : <Globe size={14} />}
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-white">Compact Mode</p>
                        <p className="text-xs text-gray-500">Reduce spacing and padding</p>
                      </div>
                      <Toggle checked={form.compactMode} onChange={(val) => setForm({ ...form, compactMode: val })} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">About Hackerzz Lobby</h3>
                  <div className="space-y-4 text-sm text-gray-300">
                    <p>Version 2.0.0 (Production)</p>
                    <p>Hackerzz Lobby is a platform for hackathon teams to collaborate, track deadlines, and discover relevant projects.</p>
                    <div className="pt-4 border-t border-[#1e2231]">
                      <h4 className="font-semibold text-white mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {['React 18', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'NeonDB', 'Prisma', 'JWT Auth'].map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded-lg bg-[#1e2231] text-gray-400 text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs pt-4">&copy; 2025 Hackerzz Lobby. All rights reserved.</p>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#1e2231]">
                {saved && <span className="text-green-400 text-sm">Settings saved!</span>}
                <Button onClick={handleSave} className="ml-auto">
                  <Save size={16} className="mr-2" /> Save Settings
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
