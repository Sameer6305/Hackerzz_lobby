import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Users, Github, Clock, ArrowRight, Trophy, Code,
  Shield, Target, Sparkles, Globe, MessageSquare, Star,
  Rocket, Brain, ChevronRight,
} from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: Users, title: 'Build Teams', desc: 'Create communities, invite teammates, and collaborate in real-time chat.', color: 'from-blue-500 to-cyan-500' },
  { icon: Github, title: 'Smart GitHub Suggestions', desc: 'Get live GitHub project recommendations matched to your hackathon domain.', color: 'from-rose-500 to-red-500' },
  { icon: Clock, title: 'Track Deadlines', desc: 'Never miss a submission. Centralized deadline tracking across all teams.', color: 'from-amber-500 to-orange-500' },
  { icon: Trophy, title: 'Hackathon Explorer', desc: 'Browse, compare, and join hackathons with detailed info and tech stacks.', color: 'from-emerald-500 to-green-500' },
];

const stats = [
  { value: '500+', label: 'Hackathons', icon: Trophy },
  { value: '10K+', label: 'Developers', icon: Users },
  { value: '50+', label: 'Communities', icon: Globe },
  { value: '24/7', label: 'Real-Time Chat', icon: MessageSquare },
];

const marqueeItems = [
  'ETH Global Singapore 2025 - $100K Prize Pool',
  'HackMIT - Applications Open Now',
  'Google Summer of Code 2025 - Register Today',
  'Solana Hackathon - Build the Future of Web3',
  'AI/ML Challenge - Microsoft Azure Credits',
  'Open Source Contributor Summit 2025',
  'React Conf Hackathon - Win Exclusive Swag',
  'DeFi Innovation Challenge - $50K in Bounties',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white overflow-x-hidden">
      {/* Scrolling Marquee/Ticker */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-8 text-sm font-medium text-white/90 flex items-center gap-2">
              <Sparkles size={12} className="text-yellow-300" /> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
          {/* Navbar */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                <Zap size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-wide">HACKER.DEV</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#mission" className="hover:text-white transition">Mission</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/signin">
                <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
                <Rocket size={14} /> Built for hackathon teams
              </span>
              <h1 className="text-5xl sm:text-7xl font-bold leading-tight mb-8">
                Your hackathon
                <br />
                <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                  command center
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Organize your team, track deadlines, collaborate via real-time chat, and discover
                the perfect GitHub projects — all in one powerful workspace.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="group px-8">
                    Start Building Free
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="px-8 border-[#1e2231] text-gray-300 hover:bg-[#151822]">
                    See Features
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-[#1e2231] bg-[#151822]/50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon size={24} className="text-indigo-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">win hackathons</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Powerful tools designed to give your team the competitive edge.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#151822] border border-[#1e2231] rounded-2xl p-8 hover:border-indigo-500/20 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-[#151822]/50 border-y border-[#1e2231]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                About
              </span>
              <h2 className="text-3xl font-bold mb-6">Why Hacker.Dev?</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                We noticed hackathon teams struggle with fragmented tools — Discord for chat,
                Notion for deadlines, and random Google searches for inspiration. We built
                Hacker.Dev to unify everything in one beautifully designed platform.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: 'Secure NeonDB-powered backend with real-time data' },
                  { icon: Brain, text: 'Smart GitHub suggestions via live API integration' },
                  { icon: Target, text: 'Centralized deadline tracking across all communities' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                      <Icon size={16} className="text-indigo-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#1e2231] to-[#151822] border border-[#2a2f3f] rounded-2xl p-8"
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Code, label: 'Full-Stack', value: 'React + Node.js' },
                  { icon: Globe, label: 'Database', value: 'Prisma + SQLite' },
                  { icon: Shield, label: 'Auth', value: 'JWT + bcrypt' },
                  { icon: Github, label: 'Integration', value: 'GitHub Live API' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <Icon size={24} className="text-indigo-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-sm font-medium text-white">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div id="mission" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            Our Mission
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Empowering the next generation of{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">innovators</span>
          </h2>
          <div className="bg-gradient-to-br from-[#1e2231] to-[#151822] border border-[#2a2f3f] rounded-2xl p-8 sm:p-12 relative">
            <div className="absolute top-6 left-8 text-5xl text-indigo-600/20 font-serif">&ldquo;</div>
            <blockquote className="text-lg sm:text-xl text-gray-300 leading-relaxed italic relative z-10">
              Every great project starts with a team that believes in an idea.
              We&apos;re here to make sure that team has every tool it needs to
              turn that idea into reality — from the first brainstorm to the
              final submission.
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">The Hacker.Dev Team</p>
                <p className="text-xs text-gray-500">Building for builders</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600/10 via-primary-500/10 to-primary-600/10 border-y border-[#1e2231]">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to build something amazing?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of developers using Hacker.Dev to organize their hackathon teams.
            </p>
            <Link to="/register">
              <Button size="lg" className="px-10 group">
                Get Started Free
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e2231] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-400">HACKER.DEV</span>
          </div>
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Hacker.Dev. Built with passion for hackathon teams.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-300 transition">Features</a>
            <a href="#about" className="hover:text-gray-300 transition">About</a>
            <a href="#mission" className="hover:text-gray-300 transition">Mission</a>
          </div>
        </div>
      </footer>

      {/* Marquee CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
