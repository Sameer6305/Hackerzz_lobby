import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logoImg from '../../assets/logo.png';
import {
  LayoutDashboard, Users, Clock, User, Settings, Bell,
  Briefcase, Trophy, LogOut, ChevronLeft, ChevronRight,
  Zap, Search, PlusCircle, Moon, Sun,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/deadlines', label: 'Deadlines', icon: Clock },
  { to: '/recent-hackathons', label: 'Hackathons', icon: Trophy },
  { to: '/activity', label: 'Activity', icon: Briefcase },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { effectiveTheme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen surface-base flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} surface-card border-r border-theme flex flex-col transition-all duration-300 fixed top-0 left-0 h-full z-40`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-theme">
          <img
            src={logoImg}
            alt="Hackerzz Lobby"
            className="w-10 h-10 rounded-lg flex-shrink-0 object-contain"
            draggable="false"
          />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-400'
                    : 'text-label hover:text-heading'
                  }`}
                style={!isActive ? { ['--tw-bg-opacity']: undefined } : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Create Community Button */}
        <div className="px-3 pb-3">
          <Link
            to="/create-community"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-all w-full justify-center"
          >
            <PlusCircle size={18} />
            {!collapsed && <span>Create Community</span>}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 border-t border-theme text-hint hover:text-heading transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Top Appbar */}
        <header className="sticky top-0 z-30 surface-card backdrop-blur-xl border-b border-theme px-6 py-3" style={{ opacity: 0.95 }}>
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hint" />
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg surface-elevated border border-theme-secondary text-heading text-sm placeholder:text-hint focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-label hover:text-heading transition"
                title={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {effectiveTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-lg text-label hover:text-heading transition"
              >
                <Bell size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <span className="text-sm font-bold text-white">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-heading">{user?.username || 'User'}</p>
                  <p className="text-xs text-hint">{user?.email || ''}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-label hover:text-red-400 hover:bg-red-500/10 transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
