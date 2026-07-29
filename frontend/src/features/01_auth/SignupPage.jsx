import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { Dumbbell, User, Mail, Lock, ArrowRight } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/signup', { name, email, password });
      navigate('/onboarding');
    } catch (err) {
      navigate('/onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center p-container-margin py-xxxl bg-background">
      <div className="w-full max-w-[480px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-xl">
          <div className="mb-md">
            <Dumbbell className="w-12 h-12 text-primary" />
          </div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-white tracking-tighter">FitAI X</h1>
          <p className="font-body-md text-on-surface-variant/80 mt-xs">Elite Performance Intelligence</p>
        </div>

        {/* Signup Card */}
        <div className="glass-panel rounded-xxl p-xl md:p-xxl border border-white/10">
          <header className="mb-xl text-center">
            <h2 className="font-headline-md text-headline-md text-white">Join the Elite</h2>
            <p className="font-body-md text-on-surface-variant mt-xs">Enter your details to start your journey.</p>
          </header>

          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div className="space-y-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="name">
                Full Name
              </label>
              <div className="relative gold-glow group">
                <input
                  className="w-full h-14 pl-4 pr-10 rounded-xl font-body-md text-white input-gradient placeholder:text-white/20 transition-all bg-surface-container"
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <User className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
              </div>
            </div>

            <div className="space-y-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="email">
                Email Address
              </label>
              <div className="relative gold-glow group">
                <input
                  className="w-full h-14 pl-4 pr-10 rounded-xl font-body-md text-white input-gradient placeholder:text-white/20 transition-all bg-surface-container"
                  id="email"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
              </div>
            </div>

            <div className="space-y-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="password">
                Password
              </label>
              <div className="relative gold-glow group">
                <input
                  className="w-full h-14 pl-4 pr-10 rounded-xl font-body-md text-white input-gradient placeholder:text-white/20 transition-all bg-surface-container"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
              </div>
            </div>

            <button
              className="w-full h-14 bg-primary-container text-on-primary-container rounded-full font-headline-md text-[18px] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-sm mt-xl shadow-[0_10px_30px_rgba(245,196,0,0.2)] cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <footer className="mt-xl text-center">
            <p className="font-body-md text-on-surface-variant">
              Already part of the elite?{' '}
              <Link className="text-primary font-bold hover:underline ml-xs" to="/login">
                Sign In
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
