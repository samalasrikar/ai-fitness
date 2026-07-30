import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShaderCanvas from './components/ShaderCanvas';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="w-full flex-1 flex flex-col relative overflow-hidden bg-[#0A0A0A]">
      {/* Scrollable Welcome Canvas */}
      <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-center items-center px-6 py-6">
        
        <div className="w-full flex flex-col items-center text-center space-y-6 pt-4 animate-in fade-in duration-300">
          {/* Futuristic WebGL AI Orb graphic */}
          <div className="relative animate-float my-4">
            <div className="w-48 h-48 rounded-full relative z-10 overflow-hidden shadow-[0_0_65px_rgba(245,196,0,0.35)] bg-black flex items-center justify-center border border-primary/20">
              <ShaderCanvas className="w-full h-full" />
            </div>
            {/* Decorative outer rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/10 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] border border-primary/5 rounded-full"></div>
            <div className="absolute top-0 right-2 w-3 h-3 bg-primary rounded-full blur-[3px] animate-pulse"></div>
            <div className="absolute bottom-6 left-[-10px] w-2 h-2 bg-secondary-container rounded-full blur-[2px] animate-pulse delay-500"></div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-display-lg-mobile font-bold tracking-tight text-white leading-tight">
              Welcome to the <br/>
              <span className="text-primary">Future of Fitness</span>
            </h1>
            <p className="text-sm text-on-surface-variant/80 max-w-xs mx-auto leading-relaxed">
              Your journey to elite performance starts here. Let FitAI X craft your perfect path with hyper-personalized intelligence.
            </p>
          </div>

          {/* Button & Meta */}
          <div className="w-full pt-4 space-y-4">
            <button 
              onClick={() => navigate('/signup')}
              className="group relative w-full py-4 rounded-full bg-primary text-black font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Let's Begin
              <span className="material-symbols-outlined text-black text-sm font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>

            <button 
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-full border border-white/10 text-on-surface hover:bg-white/5 font-bold text-xs tracking-widest uppercase cursor-pointer active:scale-95 transition-all"
            >
              Sign In
            </button>

            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="flex -space-x-2">
                <img className="w-6 h-6 rounded-full border border-black object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5B0YXGpV9gj_C0Mp5r1RtPfDmN8fHaWdddXBDihTEkypbyCHHwHPfN_qJYhlDtCesLyDCW9CW_G6H8VPyr_GOUY1KNQk8ZlV8WJuPf5OQpZKaa2U1xXlqZYCVaTXqDRyECOCpa8KWIUnn6V2pPIQ1c7TXJt9wO7mSGvyv48tIMJ3nLijVDdX9LSQhvMt2fWI1Tz2NBViPh8UVC4u7v-NjWMpHFHNH0ndySFfrq6FJ57tV3wdLxOMx6g" />
                <img className="w-6 h-6 rounded-full border border-black object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD99YDPKFxQxHg7ZFXH3FMidAd3d2uuZ8ZXUqiEsCwCjFvSH69zuNMlJbhKY5-XWd8Av02vAS-BIzWgNQs9BPr3vdsfxaD_oWDWF9WkxjvU-hMrjb35GoE7FjlF8i7IWVn2qS-H8WZPO7Om93-vK1-D4naL_0xxqIKL4i_Z2OK6bOq8PZhoyXiGSP73Q3dGCIIEj1TgfWVF-rPLjedke1gn9UCOqcVhy-IliyYzN8lEZOuy6fdY9CHPSA" />
                <div className="w-6 h-6 rounded-full bg-surface-container border border-black flex items-center justify-center text-[7px] text-primary font-black">+10k</div>
              </div>
              <span className="text-[9px] font-bold text-on-surface-variant/60 tracking-wider uppercase">Join 10,000+ Elite Athletes</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Identity */}
      <footer className="py-6 px-6 text-center">
        <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.25em]">
          POWERED BY FITAI NEURAL CORE v4.0
        </p>
      </footer>
    </div>
  );
}
