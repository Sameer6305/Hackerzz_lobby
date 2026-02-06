import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Users, Github, Clock, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: Users, title: 'Build Teams', desc: 'Create communities, invite teammates, and collaborate in real-time.' },
  { icon: Github, title: 'Smart Suggestions', desc: 'Get AI-powered GitHub project recommendations matched to your hackathon.' },
  { icon: Clock, title: 'Track Deadlines', desc: 'Never miss a submission. Shared timelines keep everyone aligned.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-dark-900">Hackerzz Lobby</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Hero Text */}
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6">
                Built for hackathon teams
              </span>
              <h1 className="text-5xl sm:text-6xl font-bold text-dark-900 leading-tight mb-6">
                Your hackathon{' '}
                <span className="gradient-text">command center</span>
              </h1>
              <p className="text-lg text-dark-500 mb-10 max-w-2xl mx-auto">
                Organize your team, track deadlines, collaborate via chat, and discover
                the perfect GitHub projects — all in one beautiful workspace.
              </p>
              <Link to="/register">
                <Button size="lg" className="group">
                  Start Building
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card p-8 text-center hover:shadow-glow transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{f.title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-100 py-8 text-center text-sm text-dark-400">
        &copy; {new Date().getFullYear()} Hackerzz Lobby. Built with passion.
      </footer>
    </div>
  );
}
