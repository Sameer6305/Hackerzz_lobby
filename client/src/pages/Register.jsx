import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Zap, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center surface-base px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-heading">Create account</h1>
          <p className="text-hint text-sm mt-1">Join the hackathon community</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hint mt-3" />
            <Input label="Email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="pl-10" required />
          </div>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hint mt-3" />
            <Input label="Username" value={form.username} onChange={update('username')} placeholder="cool_hacker" className="pl-10" required />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hint mt-3" />
            <Input label="Password" type="password" value={form.password} onChange={update('password')} placeholder="••••••••" className="pl-10" required />
          </div>
          <Input label="Confirm Password" type="password" value={form.confirm} onChange={update('confirm')} placeholder="••••••••" required />
          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-hint mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary-600 font-medium hover:text-primary-700 transition">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
