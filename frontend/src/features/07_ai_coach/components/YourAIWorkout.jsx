import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const EXERCISES = [
  { name: 'Incline Barbell Bench Press', sets: '4 × 10', rpe: 8, muscle: 'Chest', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTSwW3nGksiRF6m13pkxUFjfLWddH57zrLBSL-IrIFabgBOV1rZenklkBgJKmcfLv9CJgCCNbFYIHB_LWnOkL4nJkptzpewJloYBEjE6Ui0VRQ49bJLsoxjStKJOuOTPH57r8Ach2VIneNgf4MC8SYoFMphUeg1z1EyW-OKsl36rKNLrPIwFn0khcI52xyvU_UumOjqD6VbEVv862SDUJGN3WQBTdqkiYrYgmdVDtkc9zo8sVxMMcwCQ' },
  { name: 'Dumbbell Shoulder Press', sets: '3 × 12', rpe: 7, muscle: 'Shoulders', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQIsEmU8JX5zknoa8xj0JroiUKQZIdfIlYIngVX9lDq039w4gSK_vloKKqWlryZvZPn9b2YAMYiNnFplj6yYBnj6BhSsm-yoJOBxcJNp_OY6cRY0lRuEv-RnxTUGGbAQuBHWdlMjs1wDOSRuT66OQFR_gKvDVblff2cJQrFNapZwnUgVONmu9sSfU5e7gh9McPx4-KCDqywwq-fCPN1M6qoKZ2grTHu665S2h-jy2yujBIahGd-txa5w' },
  { name: 'Tricep Pushdown (Cable)', sets: '4 × 15', rpe: 7, muscle: 'Triceps', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG1V3ceLWvDwZd9vNRV9wESR3rm8pXIuzDLku_lROWL-SUsa_sr4I4CBaOJi6cehCuWgoBksaxGkzeEOtuweKWie_fCgiamLzpUGmj8mIQnePBcQR3ou6gFkXIHl70g_UTLA3DRNS8i438RMx794pdprHMF8wuOhlPJdr8RtwURA6apzOwtqIMPIctHJJUi2D9_jhakPNbx6fbSbZC0lpL5kvqjF088wxiP4rfNU61UC6t0Xv0qsolAA' },
  { name: 'Cable Lateral Raises', sets: '3 × 15', rpe: 6, muscle: 'Delts', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChu7RLrQamqKK5PNM0w6nCzxttTNYJPLeFhQV_NyT3jU5byKiyY-OddRM3pauwAadmcMeiM4ABr5sou4SMF3NiOZSHBg9VXLBxZxuA0zMsyp9idNFAXUvg7z41Vd5UpVqMqlFa2cmmZfUwbHQloVABemuHX7s-wS56PnFrytxK74r9SRkUxG2Gzjoy2toEK5CjQb-nqrtyXFK0mqkBKzkX_5O80TQ5bVaEmfiCs0X88D9WMKTdfkJQag' },
];

export default function YourAIWorkout() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-5">
        {/* Plan header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-xl p-5 relative overflow-hidden"
          style={{ background: 'radial-gradient(at 0% 0%, rgba(245,196,0,0.07) 0px, transparent 50%), rgba(32,31,31,0.6)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[100px] text-[#f5c400]">fitness_center</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#f5c400] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">AI Generated Plan</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#e5e2e1] mb-1">Hypertrophy Push Day</h2>
          <p className="text-sm text-[#d1c5ab] mb-4">Engineered for peak neuromuscular recruitment based on your biometrics.</p>
          <div className="flex flex-wrap gap-2">
            {['75 Min', 'Intensity 8/10', '4 Exercises', '24 Sets'].map(t => (
              <div key={t} className="bg-[#0e0e0e] border border-white/10 px-3 py-1 rounded-lg">
                <span className="text-[11px] text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{t}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Exercise list */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#d1c5ab]">Exercise Sequence</h3>
          {EXERCISES.map((ex, i) => (
            <motion.div key={ex.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i, duration: 0.35 }}
              className="rounded-xl overflow-hidden flex items-center gap-4 p-4 cursor-pointer hover:border-[#f5c400]/20 transition-all"
              style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/5">
                <img className="w-full h-full object-cover" src={ex.img} alt={ex.name} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#e5e2e1] truncate">{ex.name}</h4>
                <div className="flex gap-3 mt-1">
                  <span className="text-[11px] text-[#f5c400] font-[JetBrains_Mono,monospace]">{ex.sets}</span>
                  <span className="text-[11px] text-[#d1c5ab]">RPE {ex.rpe}</span>
                  <span className="text-[11px] text-[#d1c5ab]/60">{ex.muscle}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#d1c5ab]/30">chevron_right</span>
            </motion.div>
          ))}
        </div>

        {/* AI insight */}
        <div className="rounded-xl p-4 flex items-start gap-3 border border-[#f5c400]/20 bg-[#f5c400]/5">
          <div className="w-9 h-9 rounded-full bg-[#f5c400]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#f5c400]">psychology</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400] block mb-1">FITAIX INSIGHT</span>
            <p className="text-sm text-[#d1c5ab] leading-relaxed">"Excellent readiness window. CNS output should peak between sets 2–4. Increase bench by 5lbs if bar speed feels easy."</p>
          </div>
        </div>
      </main>

      {/* Start CTA */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 z-40">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/workout/in-progress')}
          className="w-full h-14 bg-[#f5c400] text-black font-bold rounded-xl flex items-center justify-center gap-3 text-base hover:brightness-105 transition-all"
          style={{ boxShadow: '0 0 25px rgba(245,196,0,0.3)' }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          Begin Session
        </motion.button>
      </div>

      <BottomNav activeId="workout" />
    </div>
  );
}
