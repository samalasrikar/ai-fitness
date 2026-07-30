import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const C = 2 * Math.PI * 110; // ≈ 691

export default function WorkoutInProgress() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(31 * 60 + 45);
  const [paused, setPaused] = useState(false);
  const [setNum, setSetNum] = useState(2);
  const totalSets = 4;
  const progress = (setNum - 1) / totalSets;
  const dashOffset = C * (1 - progress);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const completeSet = () => {
    if (setNum >= totalSets) navigate('/workout/session-complete');
    else setSetNum(s => s + 1);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-28 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#353534] border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#f5c400] text-sm">person</span>
            </div>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button className="material-symbols-outlined text-[#f5c400] hover:opacity-80 transition-opacity">settings_heart</button>
        </div>
      </header>

      <main className="flex-1 pt-20 pb-28 px-6 max-w-lg mx-auto w-full space-y-5">
        {/* Timer Ring */}
        <section className="flex flex-col items-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="110" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="128" cy="128" r="110"
                fill="transparent"
                stroke="#f5c400"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={C}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]/60 mb-1">Session Time</span>
              <h1 className="text-5xl font-extrabold text-[#f5c400] tracking-tighter" style={{ textShadow: '0 0 20px rgba(245,196,0,0.4)' }}>{fmt(seconds)}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#f5c400] animate-pulse" />
                <span className="text-[11px] font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">In Progress</span>
              </div>
            </div>
          </div>
        </section>

        {/* Current Exercise */}
        <section className="rounded-xl p-5 relative overflow-hidden border border-white/5 group"
          style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(24px)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5c400]/10 via-transparent to-transparent opacity-30 pointer-events-none" />
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400] block mb-1">Current Exercise</span>
              <h2 className="text-lg font-bold text-[#e5e2e1] leading-tight">Incline Barbell Bench Press</h2>
            </div>
            <div className="bg-[#353534]/50 px-3 py-1 rounded-full border border-white/5">
              <span className="text-[11px] font-bold text-[#d1c5ab] font-[JetBrains_Mono,monospace]">Set {setNum} of {totalSets}</span>
            </div>
          </div>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4 border border-white/10 group-hover:border-[#f5c400]/30 transition-colors">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTSwW3nGksiRF6m13pkxUFjfLWddH57zrLBSL-IrIFabgBOV1rZenklkBgJKmcfLv9CJgCCNbFYIHB_LWnOkL4nJkptzpewJloYBEjE6Ui0VRQ49bJLsoxjStKJOuOTPH57r8Ach2VIneNgf4MC8SYoFMphUeg1z1EyW-OKsl36rKNLrPIwFn0khcI52xyvU_UumOjqD6VbEVv862SDUJGN3WQBTdqkiYrYgmdVDtkc9zo8sVxMMcwCQ" alt="Bench Press" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {[{ label: 'Target Weight', val: '185', unit: 'lbs' }, { label: 'Target Reps', val: '10', unit: 'reps' }].map(s => (
              <div key={s.label} className="bg-[#0e0e0e]/80 border border-white/5 p-3 rounded-lg">
                <span className="text-[10px] font-semibold text-[#d1c5ab]/60 block mb-1">{s.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-[#f5c400] font-[JetBrains_Mono,monospace]">{s.val}</span>
                  <span className="text-sm text-[#d1c5ab] font-[JetBrains_Mono,monospace]">{s.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Controls */}
        <section className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button onClick={() => setPaused(p => !p)} className="flex-1 rounded-xl py-4 flex items-center justify-center gap-2 font-semibold text-sm hover:bg-white/5 active:scale-95 transition-all border border-white/10"
              style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(24px)' }}>
              <span className="material-symbols-outlined">{paused ? 'play_arrow' : 'pause'}</span>
              {paused ? 'Resume' : 'Pause'}
            </button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={completeSet}
              className="flex-1 bg-[#f5c400] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm"
              style={{ boxShadow: '0 10px 30px rgba(245,196,0,0.2)' }}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Complete Set
            </motion.button>
          </div>
          <button onClick={() => navigate('/workout/session-complete')} className="w-full text-[#d1c5ab] font-medium py-3 rounded-full hover:text-red-400 transition-colors flex items-center justify-center gap-2 text-sm">
            <span className="material-symbols-outlined text-sm">stop_circle</span>Finish Session
          </button>
        </section>

        {/* AI Insight */}
        <div className="rounded-xl p-4 flex items-start gap-4 border border-[#f5c400]/20"
          style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(24px)' }}>
          <div className="w-10 h-10 rounded-full bg-[#f5c400]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#f5c400]">psychology</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400] block mb-1">FITAIX INSIGHT</span>
            <p className="text-sm text-[#d1c5ab] leading-relaxed">"Your bar speed on the first set was elite. Increase weight by 5lbs next set to optimize muscle recruitment."</p>
          </div>
        </div>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
