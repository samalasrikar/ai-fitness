import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || password !== confirmPassword) return;

    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/setup');
    }, 1200);
  };

  const handleSocialSignup = (provider) => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/setup');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-on-surface font-body-md flex items-center justify-center selection:bg-primary/30 relative overflow-hidden">
      {/* Mobile Simulator Viewport */}
      <div className="w-full max-w-md h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden border-x border-white/5 shadow-2xl">
        
        {/* Scrollable container */}
        <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-center px-6 py-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex w-12 h-12 rounded-full bg-primary/10 items-center justify-center border border-primary/20 mb-2">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
            </div>
            <h1 className="text-display-lg-mobile font-bold tracking-tight text-white leading-tight">
              Join the <span className="text-primary">Elite</span>
            </h1>
            <p className="text-xs text-on-surface-variant max-w-[280px] mx-auto leading-relaxed">
              Enter your credentials to launch your neural training core.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">person</span>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-14 pl-4 pr-11 bg-surface-container-low rounded-xl border border-white/5 text-on-surface placeholder:text-white/20 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">mail</span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full h-14 pl-4 pr-11 bg-surface-container-low rounded-xl border border-white/5 text-on-surface placeholder:text-white/20 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Fields Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 px-4 bg-surface-container-low rounded-xl border border-white/5 text-on-surface placeholder:text-white/20 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-xs transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">Confirm</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 px-4 bg-surface-container-low rounded-xl border border-white/5 text-on-surface placeholder:text-white/20 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isCreating || !name || !email || !password || password !== confirmPassword}
              className="w-full h-14 bg-primary hover:bg-primary-fixed-dim text-black font-bold text-xs tracking-widest uppercase py-4 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  Create Account
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
              onClick={() => handleSocialSignup('Google')}
              className="h-14 bg-surface-container rounded-xl border border-white/5 flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer"
            >
              <img alt="Google" className="w-5 h-5 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDafpAorcMqRejHsOpp2wyvgZVEv9haL3OKJeYzLc0Ql66Sqrlrx2dzYoKrXQQryIt6tmG6Kf_I3UWVK-ZFeImpy1OhcJNXkuk7_tKNRtDR-ugEKxFNj-snDWOKlPW-Bj0_FLJGOMP2o3dsrj-XVBa-LVndjBs4JbD-AAsGv5ov_awEgsSEFS9Zd6Vl8u4oEfY6jGm3eumZh_f9fdx2DoB8PC65Q3XtccpCwXWIsoAagoUPy5IvqV1kMA" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Google</span>
            </button>
            <button 
              onClick={() => handleSocialSignup('Apple')}
              className="h-14 bg-surface-container rounded-xl border border-white/5 flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer"
            >
              <img alt="Apple" className="w-5 h-5 opacity-80 filter invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDibuEtXFVLvkruGZWoYWiY3knPuyjxA6pHLMXZ-MPIALoydWiyBYWKc05uElhv883vQ0i8qxN1x0ahq80x-TdXABeEidKaVRcA0DEe2UphGHcRPVJi5c5c-iGQo9ozZpV8mNkTG1FPO5ZKLYLp83SpMIQmI-GOmQP34n77KQvwBauS88FmHb89ROeLVglIipDNJqgRVVfMBBV2A0ELwYmwJb6T1HzWTd1IOX0cCBN1vdhKJYYuY4bU-g" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Apple</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-on-surface-variant font-medium">
              Already part of the elite?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </div>

        </main>

        {/* Bottom Disclaimer */}
        <p className="text-center font-label-caps text-[8px] text-on-surface-variant/40 px-6 leading-relaxed">
          By creating an account, you agree to our Terms of Service and Privacy Policy. FitAI X uses advanced biometric encryption.
        </p>

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
