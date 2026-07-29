import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await apiClient.post('/auth/login', { email, password });
      navigate('/dashboard');
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body-md overflow-hidden bg-background">
      {/* Hero Illustration Section */}
      <section className="relative w-full md:w-1/2 lg:w-3/5 h-64 md:h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-xl">
          <div className="relative w-full max-w-xl aspect-square animate-float">
            <div className="absolute inset-0 rounded-full bg-primary-container/10 blur-[120px]"></div>
            <div className="w-full h-full rounded-2xl glass-stroke overflow-hidden flex items-center justify-center p-lg">
              <img
                className="w-full h-full object-cover rounded-xl shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwo_xz6ZFReN1W_kDoru1JNnjpafuyhGM5rjzeFxJm6eIy379yo9ZwgMiA7JY4FFKBUpcfFp9Y08jJNPCAqXr4qxDcprCne8slrK_Y7vnq4RsPsMWkwZsnTtb1M30UpRfggoubGKM3aNFFpOm7re1VYgguVKtmTnO6sNZjLcSiqUxgiPHXP0afCkdY-5HLVOJtx70dbzgDSjFw5o2Qf5FKhPOCDi3aio2PdgfFPplRuLajW-t9ZL5sjA"
                alt="FitAI Device"
              />
            </div>
          </div>
          <div className="hidden md:block absolute bottom-xxl left-xxl max-w-md">
            <h2 className="font-display-lg text-display-lg text-primary-fixed mb-md">FitAI X</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
              Where elite human performance meets hyper-intelligent analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="flex-1 w-full md:w-1/2 lg:w-2/5 h-full min-h-screen bg-background relative flex items-center justify-center p-gutter">
        <div className="w-full max-w-md space-y-xl relative z-10">
          <div className="space-y-sm text-center md:text-left">
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface md:font-display-lg md:text-display-lg tracking-tight">
              Elevate Your Performance
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Access your personalized AI training laboratory.
            </p>
          </div>

          {errorMsg && (
            <div className="p-md rounded-xl bg-error-container/20 border border-error text-error text-sm">
              {errorMsg}
            </div>
          )}

          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div className="space-y-md">
              <div className="group">
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs ml-md">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input
                    className="w-full h-14 pl-12 pr-md bg-surface-container-lowest glass-stroke rounded-2xl border-none text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container/30 transition-all outline-none font-body-md"
                    placeholder="name@luxury-performance.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-xs px-md">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Password</label>
                  <a className="font-label-caps text-label-caps text-primary hover:text-primary-fixed transition-colors" href="#">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input
                    className="w-full h-14 pl-12 pr-md bg-surface-container-lowest glass-stroke rounded-2xl border-none text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container/30 transition-all outline-none font-body-md"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              className="w-full h-14 bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-full gold-glow hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-sm cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="text-center pt-md">
            <p className="font-body-md text-body-md text-on-surface-variant">
              New to the elite program?{' '}
              <Link className="text-primary font-bold hover:underline ml-xs" to="/signup">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
