import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const TASKS = [
  { label: 'Reading recovery...', done: true },
  { label: 'Analyzing muscle recovery...', done: true },
  { label: 'Selecting exercises...', active: true },
  { label: 'Weight load calculation...', pending: true },
];

export default function AIAnalysis() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(79);
  const circleRef = useRef(null);

  useEffect(() => {
    let val = 79;
    const C = 600;
    const interval = setInterval(() => {
      val += Math.random() * 0.8;
      if (val >= 100) { val = 100; clearInterval(interval); setTimeout(() => navigate('/workout/ai-workout'), 700); }
      setProgress(Math.floor(val));
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(C - (val / 100) * C);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-28 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          <div className="flex items-center gap-3">
            <button className="material-symbols-outlined text-[#d1c5ab]/60 hover:text-white transition-colors">settings_heart</button>
            <div className="w-8 h-8 rounded-full bg-[#353534] overflow-hidden border border-white/10">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO7wZSJUN3d5QzOsxPLFEFKKsLpkmt2cka9tDYpumGEW_kWJluDa_Zf42S2AfqOy3vXOhcXLc5Bi67-eRuMlQhKQH6iAaIsS0J0b5ZJu71Y6uoQXY2Wf7HMWiB3DBBhsW5mMHR7n_UT_SjavbIEUAXikvYuK8FJ7NKV7a2wWcPPQo5gLaxDfAKzxG-sH3XRinptUWmO4hB6XDMZfNMvQFGbym-79M_-qlAzVIjaidvcUXCnyTh24aYbg" alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,196,0,0.08),transparent_70%)] opacity-40" />

        <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
          {/* AI Spinner */}
          <div className="relative mb-12">
            <div className="w-44 h-44 rounded-full flex items-center justify-center relative" style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', animation: 'pulse-gold 3s infinite' }}>
              <div className="absolute inset-0 rounded-full border border-dashed border-[#f5c400]/40 opacity-50 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="relative z-20 flex flex-col items-center">
                <span className="material-symbols-outlined text-[#f5c400] text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
                <div className="text-2xl font-semibold text-[#f5c400] font-[JetBrains_Mono,monospace] mt-2">{progress}%</div>
              </div>
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}>
                <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(245,196,0,0.1)" strokeWidth="8" />
                <circle ref={circleRef} cx="50%" cy="50%" r="48%" fill="none" stroke="#f5c400" strokeWidth="8" style={{ strokeDasharray: 600, strokeDashoffset: 126, transition: 'stroke-dashoffset 0.1s linear' }} />
              </svg>
            </div>
          </div>

          {/* Status list */}
          <div className="w-full space-y-3">
            <div className="text-center mb-5">
              <h1 className="text-2xl font-bold text-[#e5e2e1] mb-1">Optimizing Neural Plan</h1>
              <p className="text-sm text-[#d1c5ab]">FITAIX is synthesizing your biomechanical data...</p>
            </div>

            {TASKS.map((t) => (
              <div key={t.label} className={`rounded-xl p-4 flex items-center justify-between relative overflow-hidden ${t.pending ? 'opacity-30 grayscale' : t.active ? '' : 'opacity-60'}`}
                style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                {t.active && (
                  <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(90deg, #1c1b1b 25%, #2a2a2a 50%, #1c1b1b 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s infinite linear' }} />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  {t.done && <span className="material-symbols-outlined text-[#f5c400]">check_circle</span>}
                  {t.active && <div className="w-5 h-5 rounded-full border-2 border-[#f5c400] border-t-transparent animate-spin" />}
                  {t.pending && <span className="material-symbols-outlined text-[#d1c5ab]">hourglass_empty</span>}
                  <span className="text-sm text-[#e5e2e1]">{t.label}</span>
                </div>
                <span className={`text-[11px] font-bold font-[JetBrains_Mono,monospace] relative z-10 ${t.done ? 'text-[#f5c400]/60' : t.active ? 'text-[#f5c400]' : 'text-[#d1c5ab]'}`}>
                  {t.done ? 'COMPLETE' : t.active ? 'PROCESSING' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>

          {/* Insight chip */}
          <div className="mt-8 rounded-full px-6 py-2 border border-[#f5c400]/20 flex items-center gap-2" style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(40px)' }}>
            <span className="material-symbols-outlined text-[#f5c400] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-[11px] font-bold text-[#f5c400] uppercase tracking-widest">AI INSIGHT: HRV detected 12% fatigue. Adjusting volume.</span>
          </div>
        </div>
      </main>

      <BottomNav activeId="workout" />

      <style>{`
        @keyframes pulse-gold { 0%{box-shadow:0 0 0 0 rgba(245,196,0,0.2)} 70%{box-shadow:0 0 0 20px rgba(245,196,0,0)} 100%{box-shadow:0 0 0 0 rgba(245,196,0,0)} }
        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
      `}</style>
    </div>
  );
}
