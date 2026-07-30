import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

export default function Login() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setFormError(null);

    try {
      await login(email, password);
    } catch (err) {
      setFormError(err.message || 'Invalid credentials or connection error');
    }
  };

  const handleSocialLogin = async () => {
    setFormError(null);
    try {
      await login('demo@fitai.com', 'Password123!');
    } catch (err) {
      setFormError(err.message || 'Social login error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md flex items-center justify-center selection:bg-primary/30 relative overflow-hidden">
      {/* Mobile Simulator Viewport */}
      <div className="w-full max-w-md h-screen bg-background flex flex-col relative overflow-hidden border-x border-white/5 shadow-2xl">
        
        {/* Scrollable container */}
        <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-center px-6 py-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex w-12 h-12 rounded-full bg-primary/10 items-center justify-center border border-primary/20 mb-2">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
            </div>
            <h1 className="text-display-lg-mobile font-bold tracking-tight text-white leading-tight">
              Elevate Your <br />
              <span className="text-primary">Performance</span>
            </h1>
            <p className="text-xs text-on-surface-variant max-w-[280px] mx-auto leading-relaxed">
              Access your personalized AI training laboratory.
            </p>
          </div>

          {/* Form Error Feedback */}
          {(formError || error) && (
            <div className="bg-error/10 border border-error/20 p-3.5 rounded-xl text-center">
              <p className="text-xs text-error font-medium">{formError || error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">mail</span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@luxury-performance.com"
                  className="w-full h-14 pl-11 pr-4 bg-surface-container-low rounded-xl border border-white/5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
                <a href="#" className="text-[9px] font-bold text-primary hover:text-white transition-colors uppercase tracking-wider">Forgot?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">lock</span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-11 pr-4 bg-surface-container-low rounded-xl border border-white/5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-14 bg-primary hover:bg-primary-fixed-dim text-black font-bold text-xs tracking-widest uppercase py-4 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  SIGNING IN...
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px bg-white/10 flex-grow"></div>
            <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleSocialLogin}
              className="h-14 bg-surface-container rounded-xl border border-white/5 flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer"
            >
              <img alt="Google" className="w-5 h-5 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVF6xWb1mnZIoJxVtMPMOOWcTvi5muGQCdQ3EABwwpxgt60wYAIlYiNk34EMVrUzJGIS_8_uoA_tsTJWwYmv7PlqqAK-BAD89O8uZnPy_-SzF1rEDgqDEtXYyiANN4tfoQJSLZJaz-3l8MgTScAaLAwh1zTYi6S5RzAPSPxgje1jnro95XCDpFih_Z61BpvCGnt_rJNS20nohOJqW6D90NXV3w94drg6Sh_f5YZmlP2BELHgDO1fnUyg" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Google</span>
            </button>
            <button 
              onClick={handleSocialLogin}
              className="h-14 bg-surface-container rounded-xl border border-white/5 flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer"
            >
              <img alt="Apple" className="w-5 h-5 opacity-80 filter invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDibuEtXFVLvkruGZWoYWiY3knPuyjxA6pHLMXZ-MPIALoydWiyBYWKc05uElhv883vQ0i8qxN1x0ahq80x-TdXABeEidKaVRcA0DEe2UphGHcRPVJi5c5c-iGQo9ozZpV8mNkTG1FPO5ZKLYLp83SpMIQmI-GOmQP34n77KQvwBauS88FmHb89ROeLVglIipDNJqgRVVfMBBV2A0ELwYmwJb6T1HzWTd1IOX0cCBN1vdhKJYYuY4bU-g" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Apple</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-on-surface-variant font-medium">
              New to the elite program?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
            </p>
          </div>

        </main>

        {/* Footer Identity */}
        <footer className="py-6 text-center">
          <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.25em]">
            Elite Performance Framework
          </p>
        </footer>

      </div>
    </div>
  );
}
