import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const CHIPS = ['Muscle Gain', 'Fat Loss', 'Strength', 'Dumbbells Only', 'HIIT'];
const GOALS = ['Hypertrophy', 'Explosive Power', 'Endurance', 'Active Recovery'];
const EQUIPMENT = ['Full Gym', 'Home Gym', 'Bodyweight Only', 'Resistance Bands'];
const TIMES = ['30 Minutes', '45 Minutes', '60 Minutes', '90 Minutes'];
const LOAD_BARS = [0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25];

export default function CreateWithAI() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [goal, setGoal] = useState(GOALS[0]);
  const [equipment, setEquipment] = useState(EQUIPMENT[0]);
  const [time, setTime] = useState(TIMES[1]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/workout/ai-analysis');
    }, 800);
  };

  const glassPanel = {
    background: 'rgba(32,31,31,0.5)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#f5c400]/20">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByJnNRTuXV0joAPFJwrxmz48GvSCdBrOTOV833xvAg0_EI4D3rmUReY028g48y47nWzy544igutWKpcgaePM4wafTzMAJiSZtA2B4o9Q6HbecN6fVU7wnHjZhhQvBBvhZ23vwz2UoDo6oftZjq3tcIPhf_19wSXB5UQYPxoUh28bAsnDnQ3avHo79qzBaB70N_rC_kpcdzb4ledZ9lObCF6DigH_xa9RB8mF-uHF6adcMM1R-NMFUldQ" alt="Profile" />
            </div>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      {/* Atmospheric blurs */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#f5c400]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#f5c400]/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative pt-20 px-6 space-y-5">
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h2 className="text-4xl font-extrabold text-[#e5e2e1] tracking-tight mb-2">
            Build your <span className="text-[#f5c400] italic">blueprint.</span>
          </h2>
          <p className="text-sm text-[#d1c5ab] leading-relaxed">The AI is ready to engineer your optimal session based on your current physical state and objectives.</p>
        </motion.section>

        {/* Prompt input */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="rounded-xl p-5 space-y-3" style={glassPanel}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">Prompt the Engine</label>
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Create today's workout..."
              className="w-full bg-[#0e0e0e] border border-[#4e4632]/50 rounded-lg px-4 py-4 text-sm text-[#e5e2e1] placeholder:text-[#d1c5ab]/40 focus:border-[#f5c400] outline-none transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="material-symbols-outlined text-[#f5c400]/60">auto_awesome</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {CHIPS.map(chip => (
              <button key={chip} onClick={() => setPrompt(chip)} className="bg-[#353534]/50 px-3 py-1 rounded-full border border-[#4e4632]/30 text-[#d1c5ab] text-[10px] font-bold hover:border-[#f5c400]/50 hover:text-[#f5c400] transition-all">
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Selectors */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }} className="grid grid-cols-3 gap-3">
          {[
            { icon: 'target', label: 'GOAL', val: goal, set: setGoal, opts: GOALS },
            { icon: 'fitness_center', label: 'EQUIPMENT', val: equipment, set: setEquipment, opts: EQUIPMENT },
            { icon: 'schedule', label: 'TIME', val: time, set: setTime, opts: TIMES },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 flex flex-col gap-1.5" style={glassPanel}>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[#d1c5ab]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">{s.icon}</span>{s.label}
              </span>
              <select
                value={s.val}
                onChange={e => s.set(e.target.value)}
                className="bg-transparent border-none text-[11px] font-bold text-[#e5e2e1] focus:ring-0 p-0 cursor-pointer outline-none"
              >
                {s.opts.map(o => <option key={o} className="bg-[#1c1b1b]">{o}</option>)}
              </select>
            </div>
          ))}
        </motion.div>

        {/* AI Intelligence preview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }} className="rounded-xl p-5 relative overflow-hidden" style={glassPanel}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5c400]/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <div className="bg-[#f5c400]/10 p-2 rounded-lg shrink-0">
              <span className="material-symbols-outlined text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#f5c400] mb-1">FITAIX Intelligence</h4>
              <p className="text-sm text-[#d1c5ab] leading-relaxed">Your CNS recovery is at <span className="text-[#f5c400] font-bold">88%</span>. Today is ideal for high-intensity compound movements.</p>
            </div>
          </div>
        </motion.div>

        {/* Generate button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-[#f5c400] text-black rounded-full font-bold text-base flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70"
          style={{ boxShadow: '0 0 25px rgba(245,196,0,0.25)' }}
        >
          {loading
            ? <><span className="material-symbols-outlined animate-spin">autorenew</span> Generating...</>
            : <><span className="material-symbols-outlined">auto_awesome_motion</span> Generate Workout</>}
        </motion.button>

        {/* Anticipated load bars */}
        <section className="border-t border-white/5 pt-5">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]/40 mb-4">Anticipated Load Profile</h3>
          <div className="h-28 flex items-end gap-1 px-2">
            {LOAD_BARS.map((h, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-t-sm transition-colors ${i === 3 ? 'animate-pulse' : ''}`}
                style={{ background: i === 3 ? '#f5c400' : 'rgba(42,42,42,1)' }}
                initial={{ height: 0 }}
                animate={{ height: `${h * 100}%` }}
                transition={{ delay: 0.05 * i + 0.4, duration: 0.5, ease: 'easeOut' }}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
