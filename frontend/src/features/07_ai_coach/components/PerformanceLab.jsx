import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const EXERCISES = [
  {
    name: 'Barbell Flat Bench Press',
    details: '4 Sets • 8-10 Reps • 225 lbs',
    pr: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp4Npp-WCVbDYy-Wgb1yM-56E-v-WZgEKnlMxaeZhJQbYnSh1k0tbSlauhsi1msS95gcy7ESqs9fK3sXtR0IPR7QZK5ELmWQb2dBofPKc7EFm9vefG-BfMig-a0LQWCM7nMz8yrFIyyMqaYeBa2X6ZBJRA0vEMW0lPClCQ_1hGktazZOeprw6sYhnPvIDcAvDpH1-OOVmwYxNRtQxY4mlPEmluMUa2srC4EPsQ-FX5k3Hok94bwLFLaw',
  },
  {
    name: 'Weighted Pull-Ups',
    details: '3 Sets • 12 Reps • +45 lbs',
    pr: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD__6lTIhW-Bu-Aj1APdNdmMuG7WCWxKF80lvTf7YqwIjqjF-3DczjBxPAvmUs6aB-PHJl2UnEkASYNw4z-02AyixVR98pEYnzXc4MztLbUiRWX4E7SgvfNwroC8Df4Kmx4RC6PnP2ZFY86dL-8V5E2q0qEAYTVWadhgEpiN6RedRa7mF7l0ymgPBx5G6T6HUAbTTJH1VwYc5heX4o25n66Avjd3N_qFL_MR1QLsb9smytUkZwkk3Ra5Q',
  },
  {
    name: 'Incline Cable Fly',
    details: '3 Sets • 15 Reps • 60 lbs',
    pr: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRxGz7vwb4ct6z6aDE4zmw0GmVZCBYfkgyOEyVNuqjGC2e6zrE5KCBllLwDctk9intBzYUlwf7iNb8lR_A9-hSCia6uXPYoGILXqlzzSnd0cJBUyWLcDf31xuYLxgKMava0ljKFbNAKs5UR5yXn-juPtnzA_f2OPem180-2N7ufJOORfDNl8mV5GWF1lmjcpwLUXpVGcBzpBDfY_ecKZvPPKujqv6BWwqq2-_L-QtLuPG1phU9Uw3khg',
  },
];

const INTENSITIES = [40, 60, 55, 85, 100, 80, 60, 45, 50, 30, 65, 80, 92, 60, 40];

export default function PerformanceLab() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#f5c400]/20">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9HcW8OBEGQyhSvw1mg6oUjyJpee5nYr9UVoBtP63YDKc4LFTJ6wTz5XyUO2ZskkOKVqpOfiBoUE1o1XT6CxltXW5uIyMpGU72qMep6FlJU-_fkYTfiUGZzFIUFjMjWdhCZDAysnqGtkNC5tYGQIzpqV9tHf9PIhOhMO_Yd1TRWvoqGX6wOkbq7DgAAzoFkGcPlVk90o0gWcs9wgX1uDBxztU9zaAVBNpcUNJUk9tmaOEHqYupb68o-Q" alt="Athlete" />
            </div>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button className="text-[#f5c400] hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]">SESSION COMPLETE</span>
          <h2 className="text-2xl font-extrabold text-[#e5e2e1] mt-1">Hypertrophy B: Upper Body</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-[#f5c400]">
            <span className="flex items-center gap-1 font-[JetBrains_Mono,monospace]">
              <span className="material-symbols-outlined text-[18px]">timer</span> 68m 12s
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 font-[JetBrains_Mono,monospace]">
              <span className="material-symbols-outlined text-[18px]">bolt</span> 482 kcal
            </span>
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="space-y-4">
          {/* Intensity Architecture Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-xl p-5 relative overflow-hidden"
            style={{ background: 'radial-gradient(at 0% 0%, rgba(245,196,0,0.06) 0px, transparent 50%), rgba(32,31,31,0.4)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-bold text-[#e5e2e1]">Intensity Architecture</h3>
                <p className="text-xs text-[#d1c5ab]">Real-time cardiovascular exertion mapping</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">172 BPM</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab]">HR PEAK</div>
              </div>
            </div>
            {/* Custom Bar Graph */}
            <div className="h-40 flex items-end justify-between gap-1.5 pt-4">
              {INTENSITIES.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.03 * i + 0.2, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-sm"
                  style={{
                    background: h === 100 ? '#f5c400' : `rgba(245, 196, 0, ${h / 100})`,
                    boxShadow: h === 100 ? '0 0 12px rgba(245,196,0,0.5)' : 'none',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Volume Delta / Growth Index Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-xl p-5 flex flex-col justify-between border border-[#f5c400]/10"
            style={{ background: 'rgba(32,31,31,0.4)', backdropFilter: 'blur(24px)' }}>
            <div>
              <h3 className="text-base font-bold text-[#e5e2e1]">Growth Index</h3>
              <p className="text-xs text-[#d1c5ab]">Volume vs Previous Week</p>
            </div>
            <div className="py-4">
              <div className="text-4xl font-extrabold text-[#f5c400] mb-2 font-[JetBrains_Mono,monospace]">+12.4%</div>
              <div className="w-full h-2 bg-[#353534] rounded-full overflow-hidden">
                <div className="h-full bg-[#f5c400] w-[72%] rounded-full shadow-[0_0_15px_rgba(245,196,0,0.4)]" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#f5c400] text-xs font-bold font-[JetBrains_Mono,monospace]">
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span>Superior to 89% of peer group</span>
            </div>
          </motion.div>

          {/* Completed Exercises List */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#e5e2e1]">Session Architecture</h3>
              <button className="text-[#f5c400] text-[10px] font-bold uppercase tracking-widest hover:underline">EXPORT LOG</button>
            </div>
            <div className="space-y-3">
              {EXERCISES.map((ex, i) => (
                <motion.div key={ex.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}
                  className="rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ background: 'rgba(32,31,31,0.4)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/5 shrink-0">
                      <img className="w-full h-full object-cover" src={ex.img} alt={ex.name} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#e5e2e1]">{ex.name}</h4>
                      <p className="text-[11px] text-[#d1c5ab] font-[JetBrains_Mono,monospace]">{ex.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ex.pr && (
                      <div className="bg-[#f5c400]/10 border border-[#f5c400]/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#f5c400] text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                        <span className="text-[9px] font-bold text-[#f5c400]">NEW PR</span>
                      </div>
                    )}
                    <span className="material-symbols-outlined text-[#d1c5ab]/40">chevron_right</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Insight Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}
            className="rounded-xl p-5 relative overflow-hidden"
            style={{ background: 'rgba(32,31,31,0.4)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5c400] rounded-full flex items-center justify-center text-black shrink-0">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#f5c400]">Neural Optimization Insight</h4>
                  <p className="text-xs text-[#d1c5ab] leading-relaxed mt-1">
                    Your peak intensity during Bench Press coincided with optimal metabolic efficiency. FITAIX suggests a 2.5% load increase next Tuesday.
                  </p>
                </div>
              </div>
              <button onClick={() => navigate('/workout/assistant')} className="w-full py-3 bg-[#f5c400] text-black font-bold rounded-full text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(245,196,0,0.25)] hover:brightness-110 active:scale-95 transition-all">
                ACCEPT RECOMMENDATION
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <BottomNav activeId="progress" />
    </div>
  );
}
