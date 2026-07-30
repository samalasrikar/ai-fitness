import { useLocation, useNavigate } from 'react';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

export default function SessionComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state?.session || {
    title: 'Hypertrophy Push Session',
    durationSeconds: 2740,
    totalVolumeKg: 3200,
    caloriesBurned: 482,
    rpeAvg: 8.5,
    aiFeedback: 'Great job! Progressive overload targets successfully achieved with optimal CNS readiness.',
    rating: 5,
  };

  const minutes = Math.round(session.durationSeconds / 60) || 45;

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <h1 className="text-xl font-bold text-[#f5c400] tracking-tight font-[Manrope]">Session Summary</h1>
          <button onClick={() => navigate('/dashboard')} className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6 max-w-[430px] mx-auto w-full text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-20 h-20 rounded-full bg-[#f5c400]/10 border border-[#f5c400]/30 mx-auto flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[#f5c400] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">Workout Complete!</span>
          <h2 className="text-2xl font-bold text-[#e5e2e1] mt-1">{session.title}</h2>
        </motion.div>

        {/* Key Metrics Bento */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5">
            <span className="text-[9px] text-[#d1c5ab] font-bold uppercase block mb-1">Time</span>
            <p className="text-lg font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{minutes}m</p>
          </div>
          <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5">
            <span className="text-[9px] text-[#d1c5ab] font-bold uppercase block mb-1">Volume</span>
            <p className="text-lg font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{session.totalVolumeKg}kg</p>
          </div>
          <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5">
            <span className="text-[9px] text-[#d1c5ab] font-bold uppercase block mb-1">Calories</span>
            <p className="text-lg font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{session.caloriesBurned} kcal</p>
          </div>
        </div>

        {/* AI Feedback */}
        <section className="p-5 rounded-xl border border-[#f5c400]/20 bg-[#f5c400]/5 text-left space-y-2">
          <div className="flex items-center gap-2 text-[#f5c400]">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider">FITAI Coach Post-Session Report</h3>
          </div>
          <p className="text-xs text-[#d1c5ab] leading-relaxed italic">"{session.aiFeedback}"</p>
        </section>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full h-14 bg-[#f5c400] text-black font-bold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(245,196,0,0.3)] hover:brightness-105 transition-all cursor-pointer"
        >
          Save & Return to Dashboard
        </button>
      </main>

      <BottomNav activeId="home" />
    </div>
  );
}
