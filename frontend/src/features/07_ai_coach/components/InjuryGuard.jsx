import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const BODY_PARTS = ['Right Knee', 'Left Shoulder', 'Lower Back (L4/L5)', 'Neck', 'Right Hip', 'Left Ankle'];

export default function InjuryGuard() {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState(4);
  const [bodyPart, setBodyPart] = useState('Right Knee');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Circle math for safety ring (r=70 → circumference ≈ 440)
  const circumference = 2 * Math.PI * 70;
  const safetyPct = 1.0; // 100%
  const dashOffset = circumference * (1 - safetyPct);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#f5c400]/20">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzWywleEEZNt3O6p42e2yGNkkrobZzPVjAQXrKwQYLJ47ZNoUGPs8t4XJByRl2z7xl-r5je1p7_kNb1DvaonV6Ej9fWMquLvKnXwkCa1gtaElcKvXqcyypOBBE284Rr_H3iOzj0pCAfoPfX8CgdAvIYX0kTLxw4SAxfakAVGZUq_Lx_o_2RXAOg-NZOzMcV7OZcU2YjgpBkOvCZoAVOHD-zzm-303Unjef50OF0a0z9yNTkiBk6fvl_Q"
                alt="Profile"
              />
            </div>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight font-[Manrope]">FITAIX</h1>
          </div>
          <button className="text-[#d1c5ab]/60 hover:text-white transition-colors active:scale-95">
            <span className="material-symbols-outlined text-3xl">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6 max-w-[430px] mx-auto w-full">
        {/* Safety Score Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden"
          style={{
            background: 'rgba(32,31,31,0.7)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            borderLeft: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="absolute top-0 right-0 p-4">
            <span className="material-symbols-outlined text-[#f5c400]/30 text-4xl">shield_with_heart</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] mb-5">
            Current Safety Score
          </span>
          <div className="relative w-36 h-36 flex justify-center items-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80" cy="80" r="70"
                fill="transparent"
                stroke="rgba(42,42,42,1)"
                strokeWidth="8"
              />
              <motion.circle
                cx="80" cy="80" r="70"
                fill="transparent"
                stroke="#f5c400"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-[#f5c400] leading-none">100%</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] mt-1">Optimized</span>
            </div>
          </div>
        </motion.div>

        {/* AI Detected Analysis Card */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-xl p-5 border-l-4 border-[#f5c400] relative"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(245,196,0,0.06) 0%, transparent 70%), rgba(32,31,31,0.7)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 className="text-lg font-bold text-[#f5c400] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">psychology</span>
            AI Detected Analysis
          </h3>
          <p className="text-base text-[#e5e2e1] mb-4 italic">
            "Stabilized spine with targeted quad hypertrophy."
          </p>
          <div className="flex flex-col gap-3">
            {/* Swapped exercise */}
            <div
              className="flex items-center justify-between p-3 rounded-lg border border-white/5 line-through opacity-50"
              style={{ background: 'rgba(28,27,27,1)' }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#d1c5ab]">fitness_center</span>
                <span className="text-sm">Barbell Squat</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d1c5ab]">SWAPPED</span>
            </div>
            {/* Recommended exercise */}
            <div
              className="flex items-center justify-between p-3 rounded-lg border border-[#f5c400]/30"
              style={{ background: 'rgba(245,196,0,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f5c400]">dynamic_form</span>
                <span className="text-sm font-bold text-[#f5c400]">Leg Press (45°)</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">RECOMMENDED</span>
            </div>
          </div>
        </motion.div>

        {/* User Reported Card */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-xl p-5 border-l-4 border-[#fff0c4] relative"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(245,196,0,0.06) 0%, transparent 70%), rgba(32,31,31,0.7)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 className="text-lg font-bold text-[#fff0c4] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">edit_note</span>
            User Reported
          </h3>
          <div className="flex flex-col gap-4">
            {/* Body Part Select */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]">
                Select Body Part
              </label>
              <select
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                className="bg-[#1c1b1b] border border-white/5 rounded-lg px-4 py-3 text-[#e5e2e1] text-sm font-medium focus:border-[#f5c400] outline-none transition-colors cursor-pointer"
              >
                {BODY_PARTS.map((bp) => (
                  <option key={bp}>{bp}</option>
                ))}
              </select>
            </div>
            {/* Severity Slider */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]">
                Severity (1–10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full cursor-pointer accent-[#f5c400]"
                  style={{ background: `linear-gradient(to right, #f5c400 ${(severity - 1) * 11.11}%, #2a2a2a ${(severity - 1) * 11.11}%)` }}
                />
                <span className="text-sm font-bold text-[#fff0c4] font-[JetBrains_Mono,monospace] w-8 text-right">
                  {severity}/10
                </span>
              </div>
            </div>
            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`w-full py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
                saved
                  ? 'bg-[#f5c400]/20 text-[#f5c400] border border-[#f5c400]/30'
                  : 'bg-[#2a2a2a] hover:bg-[#353534] text-[#e5e2e1] border border-white/5'
              }`}
            >
              {saved ? '✓ Saved' : 'Save Manual Entry'}
            </button>
          </div>
        </motion.div>

        {/* Physiological Impact */}
        <div
          className="rounded-xl p-4"
          style={{
            background: 'rgba(32,31,31,0.7)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] mb-3">
            Physiological Impact
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#f5c400] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[11px] font-medium text-[#f5c400] font-[JetBrains_Mono,monospace] shrink-0">
              85% Reduced Spinal Compression
            </span>
          </div>
        </div>

        {/* Apply CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/workout/assistant')}
          className="w-full py-4 rounded-full bg-[#f5c400] text-black font-bold text-base shadow-lg shadow-[#f5c400]/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield_check
          </span>
          Apply Recommended Shift
        </motion.button>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
