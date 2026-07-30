import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const HISTORY = [
  {
    date: '08:30 AM — Sep 05',
    title: 'Hypertrophy Upper A',
    tag: 'STRENGTH',
    time: '72 min',
    grade: 'A+',
    vol: '12.4t',
    intensity: '88%',
    focus: '94%',
  },
  {
    date: '06:15 PM — Sep 03',
    title: 'Posterior Chain Power',
    tag: 'HYPERTROPHY',
    time: '65 min',
    grade: 'A',
    vol: '14.8t',
    intensity: '92%',
    focus: '90%',
  },
  {
    date: '07:45 AM — Sep 01',
    title: 'Metabolic Conditioning',
    tag: 'ENDURANCE',
    time: '45 min',
    grade: 'B+',
    vol: '8.2t',
    intensity: '80%',
    focus: '86%',
  },
];

export default function TrainingHistory() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = HISTORY.filter(h => h.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border border-[#f5c400]/20 bg-[#2a2a2a] overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq9dapHiDP08KD50BTLB6AjjO1MQ9SKpBO73g3TbZo71T11VYxyiSxCUGLtR0SmppEMr-3uIRc5T4R-cJ7ioQXmd0y9SizoDkkWqtGFswg-ODkNEK4R87AKgOUcfAOkDunRfFwoSIzOHUoNFG-7lAlqm1s-QQsWPVrr8yin8UiAcZiJLu3aRlF3BWsJfbpmUgnAge98rPjmEpwUBNR4R2K__MR9puRhVnEktQ3rGv2ZYpXV4MSMa8lDg" alt="Profile" />
            </div>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {/* Header & Search */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">Performance Logs</p>
            <h2 className="text-2xl font-extrabold text-[#e5e2e1]">Workout History</h2>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d1c5ab]/60 text-sm">search</span>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full bg-[#0e0e0e] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-[#e5e2e1] placeholder:text-[#d1c5ab]/40 focus:border-[#f5c400] outline-none"
              />
            </div>
            <button className="p-3 rounded-xl border border-white/5 bg-[#201f1f] text-[#f5c400]">
              <span className="material-symbols-outlined text-xl">filter_list</span>
            </button>
          </div>
        </motion.section>

        {/* Monthly Insight Banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl p-4 border border-[#f5c400]/20 relative overflow-hidden"
          style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)' }}>
          <p className="text-[10px] font-bold text-[#f5c400]/80 mb-1">Monthly Insight</p>
          <h4 className="text-base font-bold text-[#e5e2e1] mb-2">Optimal Recovery Zone</h4>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[#d1c5ab]">Sessions Completed</span>
            <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace]">12 / 16</span>
          </div>
          <div className="w-full h-1.5 bg-[#353534] rounded-full overflow-hidden">
            <div className="h-full bg-[#f5c400] w-[75%] rounded-full shadow-[0_0_10px_rgba(245,196,0,0.5)]" />
          </div>
        </motion.div>

        {/* Timeline Cards */}
        <div className="space-y-4">
          {filtered.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i + 0.15 }}
              onClick={() => navigate('/workout/vault')}
              className="rounded-xl p-5 border border-white/5 hover:border-[#f5c400]/30 transition-all cursor-pointer space-y-3"
              style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)' }}>
              <span className="text-[10px] font-medium text-[#d1c5ab]/60 font-[JetBrains_Mono,monospace]">{item.date}</span>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-[#e5e2e1]">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#353534] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#f5c400]">{item.tag}</span>
                    <span className="text-[11px] text-[#d1c5ab]/60">• {item.time}</span>
                  </div>
                </div>
                <div className="bg-[#f5c400]/10 border border-[#f5c400]/20 w-10 h-10 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-[#f5c400]">{item.grade}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab]/40 block">Volume</span>
                  <span className="text-base font-bold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{item.vol}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab]/40 block">Intensity</span>
                  <span className="text-base font-bold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{item.intensity}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab]/40 block">Focus</span>
                  <span className="text-base font-bold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{item.focus}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav activeId="records" />
    </div>
  );
}
