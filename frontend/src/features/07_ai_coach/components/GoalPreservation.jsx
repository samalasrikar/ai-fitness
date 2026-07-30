import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const OPTIMIZATION_VECTORS = [
  {
    icon: 'layers',
    title: 'Superset Implementation',
    sub: 'Paired antagonistic groups',
    value: '+8.5%',
  },
  {
    icon: 'hourglass_top',
    title: 'Intelligent Rest Caps',
    sub: 'Adaptive recovery window',
    value: '-6.5m',
  },
];

export default function GoalPreservation() {
  const navigate = useNavigate();
  const ringRef = useRef(null);

  // Ring animation: r=88 → circumference ≈ 552.9
  const circumference = 2 * Math.PI * 88;
  const pct = 0.98;
  const targetOffset = circumference * (1 - pct);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(targetOffset);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#f5c400]/20">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjOywYAFjhDM-TehsHRGqAWYsae7B94XZb9a5c7LGeHPa40bOOBVry-16xrUvh5shVZDUpaB3YVzwlrLSaKo4t3_Hmj_Z0qysjbL6CT6QVsoIPdZj66aDL_lCrFyU2Cz9ioR5i7btecT2vLVhu_5YQqD7CEZRMYEXurjj2tvU4logQ0XYJSN5CF5xdbIu5bCOlOk4yDrN5mX6oyqNk07taBeYO9KD1-gleA3Iqtt43SrOxTPygQgFryA"
                alt="Profile"
              />
            </div>
          </div>
          <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight font-[Manrope] absolute left-1/2 -translate-x-1/2">
            FITAIX
          </h1>
          <button className="text-[#d1c5ab]/60 hover:text-white transition-colors active:scale-95">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4 text-center relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,196,0,0.08),transparent_70%)] -z-10 blur-3xl opacity-50" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#f5c400]">Protocol Updated</span>
          <h2 className="text-4xl font-extrabold text-[#e5e2e1] mt-1 tracking-tight">Optimization Complete</h2>
          <p className="text-sm text-[#d1c5ab] mt-3 leading-relaxed">
            FITAIX has restructured your session to preserve intensity while respecting your temporal constraints.
          </p>
        </motion.section>

        {/* Time Efficiency Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="rounded-xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[300px]"
          style={{
            background: 'rgba(32,31,31,0.6)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(245,196,0,0.1)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
          }}
        >
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]">Session Efficiency</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-5xl font-extrabold text-[#e5e2e1]">-15m</h3>
              <span className="text-base text-[#d1c5ab]">Time Saved</span>
            </div>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end justify-around gap-6 h-36 mt-auto z-10">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-[#353534] rounded-t-lg h-[85%] flex items-start justify-center pt-3 border border-white/5 relative overflow-hidden">
                <span className="text-xs font-medium text-[#d1c5ab]/60 font-[JetBrains_Mono,monospace]">45m</span>
              </div>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-widest">Original</span>
            </div>
            <div className="material-symbols-outlined text-[#f5c400] text-3xl self-center mb-10">trending_flat</div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t-lg h-[66%] flex items-start justify-center pt-3 border border-[#f5c400]/20 relative overflow-hidden"
                style={{
                  background: '#f5c400',
                  boxShadow: '0 -10px 30px rgba(245,196,0,0.4)',
                }}
              >
                <span className="text-xs font-bold text-black font-[JetBrains_Mono,monospace]">30m</span>
              </div>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">Optimized</span>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#f5c400]/10 blur-[100px] rounded-full pointer-events-none" />
        </motion.div>

        {/* Annual Consistency Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="rounded-xl p-5 flex flex-col items-center justify-center text-center"
          style={{
            background: 'rgba(32,31,31,0.6)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(245,196,0,0.1)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] mb-4">
            Annual Consistency
          </span>
          <div className="relative w-44 h-44 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
              <circle cx="96" cy="96" r="88" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                ref={ringRef}
                cx="96" cy="96" r="88"
                fill="transparent"
                stroke="#f5c400"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                style={{
                  transition: 'stroke-dashoffset 0.8s ease-out',
                  filter: 'drop-shadow(0 0 8px rgba(245,196,0,0.6))',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#f5c400] leading-none">98%</span>
              <span className="text-[11px] font-medium text-[#d1c5ab] font-[JetBrains_Mono,monospace] mt-1">Elite</span>
            </div>
          </div>
          <p className="text-sm text-[#d1c5ab]">Top 0.5% of FITAIX users worldwide</p>
        </motion.div>

        {/* Optimization Vectors */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="rounded-xl p-5"
          style={{
            background: 'rgba(32,31,31,0.6)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(245,196,0,0.1)',
          }}
        >
          <h4 className="text-lg font-bold text-[#e5e2e1] mb-4">Optimization Vectors</h4>
          <div className="space-y-3">
            {OPTIMIZATION_VECTORS.map((v) => (
              <div
                key={v.title}
                className="flex items-center justify-between p-3 rounded-lg border border-white/5"
                style={{ background: 'rgba(42,42,42,0.4)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f5c400]">{v.icon}</span>
                  <div>
                    <p className="text-sm font-bold">{v.title}</p>
                    <p className="text-[11px] text-[#d1c5ab]/60 font-[JetBrains_Mono,monospace]">{v.sub}</p>
                  </div>
                </div>
                <span className="text-xl font-semibold text-[#f5c400] font-[JetBrains_Mono,monospace]">{v.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Intensity Preserved */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.4 }}
          className="rounded-xl p-5 flex items-center gap-6 relative overflow-hidden"
          style={{
            background: 'rgba(32,31,31,0.6)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(245,196,0,0.1)',
          }}
        >
          <div className="z-10 flex-1">
            <h4 className="text-lg font-bold text-[#e5e2e1] mb-1">Intensity Preserved</h4>
            <p className="text-sm text-[#d1c5ab]">100% Volume Retention</p>
            <div className="mt-4 flex gap-1.5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 rounded-full"
                  style={{ background: '#f5c400', boxShadow: '0 0 10px rgba(245,196,0,0.3)' }}
                />
              ))}
              <div className="w-2 h-8 bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="ml-auto opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[100px] text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center pb-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/workout/assistant')}
            className="px-10 py-4 bg-[#f5c400] text-black font-bold text-base rounded-full flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all"
            style={{ boxShadow: '0 0 25px rgba(245,196,0,0.2)' }}
          >
            Initiate Optimized Protocol
            <span className="material-symbols-outlined">play_arrow</span>
          </motion.button>
        </div>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
