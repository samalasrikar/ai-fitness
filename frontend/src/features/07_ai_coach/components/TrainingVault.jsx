import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const SETS = [
  { set: '01', weight: '80 kg', reps: 12, rpe: 7.5 },
  { set: '02', weight: '85 kg', reps: 10, rpe: 8.0 },
  { set: '03', weight: '90 kg', reps: 8, rpe: 9.0 },
  { set: '04', weight: '95 kg', reps: 6, rpe: 9.5, top: true },
];

export default function TrainingVault() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <button onClick={() => navigate(-1)} className="text-[#f5c400] hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          <button className="text-[#f5c400] hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {/* Header */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5c400]">Archive: Session 442</span>
          <h2 className="text-2xl font-extrabold text-[#e5e2e1] mt-1">Yesterday's Protocol</h2>
          <p className="text-xs text-[#d1c5ab] mt-2 leading-relaxed">
            High-intensity push-pull hybrid focused on mechanical tension and power output. Analytics indicate peak neurological recruitment during set 3.
          </p>
          <div className="flex gap-3 mt-4">
            <div className="bg-[#353534]/50 border border-white/10 px-3 py-2 rounded-lg">
              <span className="text-[9px] font-bold text-[#d1c5ab]/60 block uppercase">DURATION</span>
              <span className="text-base font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">54:12</span>
            </div>
            <div className="bg-[#353534]/50 border border-white/10 px-3 py-2 rounded-lg">
              <span className="text-[9px] font-bold text-[#d1c5ab]/60 block uppercase">LOAD VOL</span>
              <span className="text-base font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">4.2k kg</span>
            </div>
          </div>
        </motion.section>

        {/* Hero Photo & AI Analysis */}
        <div className="space-y-4">
          <div className="rounded-xl h-48 relative overflow-hidden group border border-white/5">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDji1-Rm7KLu78H9_e-2hLCO50Vl2zA7TilZ5lQ9k_k41zAn5JEW0sI10V00Nw9_rDsoDWfHxY-bwvYvIxl8ynpdKIZRcr_wj7UyvOLweU7id2g1iz-6m8OnTP2r6WSx3px9Bmzn78bIxwunRB0zJyhc_iQBDxmcbuBAzQwsNfBqEUXdsfhxJH_T2FCMY9hJggVwkaSSvlAQGQVYu_Uqb_3nz9RxlsvS0MyoHrKPMsJs3ZMsGiZiwCFxg" alt="Gym" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="text-[10px] font-bold text-[#f5c400] bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-[#f5c400]/20">
                PEAK PERFORMANCE MODE
              </span>
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <h3 className="text-base font-bold text-[#e5e2e1]">AI Coach Analysis</h3>
            </div>
            <p className="text-xs text-[#d1c5ab] leading-relaxed mb-4">
              "Your performance yesterday exceeded predicted baseline for neural drive by 8.4%. Bench Press sets showed exceptional stability."
            </p>
            <div className="space-y-2">
              <div className="flex justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs">
                <span className="text-[#d1c5ab]">Central Nervous System</span>
                <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace]">OPTIMAL</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs">
                <span className="text-[#d1c5ab]">Metabolic Stress</span>
                <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace]">MODERATE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Protocol Detail Table */}
        <section className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5c400]/10 flex items-center justify-center border border-[#f5c400]/20 text-[#f5c400]">
                <span className="material-symbols-outlined text-xl">fitness_center</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#e5e2e1]">Barbell Bench Press</h4>
                <span className="text-[9px] font-bold uppercase text-[#d1c5ab]/60">PRIMARY PUSH • CHEST</span>
              </div>
            </div>
            <span className="bg-black/40 px-2.5 py-1 rounded-full border border-white/5 text-xs font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">95 kg Max</span>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="grid grid-cols-4 pb-2 border-b border-white/10 text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab]/40 px-2">
              <span>SET</span><span>WEIGHT</span><span>REPS</span><span className="text-right">RPE</span>
            </div>
            {SETS.map((s) => (
              <div key={s.set} className={`grid grid-cols-4 items-center p-2.5 rounded-lg text-xs ${s.top ? 'bg-[#f5c400]/10 border border-[#f5c400]/30' : 'bg-white/5'}`}>
                <span className="text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{s.set}</span>
                <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace]">{s.weight}</span>
                <span className="text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{s.reps}</span>
                <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace] text-right">{s.rpe}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeId="records" />
    </div>
  );
}
