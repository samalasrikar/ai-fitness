import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

export default function LogSession() {
  const navigate = useNavigate();
  const [setNum, setSetNum] = useState(3);
  const [weight, setWeight] = useState(40);
  const [reps, setReps] = useState(10);
  const [rpe, setRpe] = useState(8.5);
  const [notes, setNotes] = useState('');
  const [savedSets, setSavedSets] = useState([
    { set: 1, weight: 40, reps: 12, rpe: 7 },
    { set: 2, weight: 40, reps: 11, rpe: 8 },
  ]);

  const handleSaveSet = () => {
    setSavedSets(prev => [...prev, { set: setNum, weight, reps, rpe }]);
    setSetNum(s => s + 1);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
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

      <main className="pt-20 px-6 space-y-5 max-w-lg mx-auto w-full">
        {/* Header */}
        <section className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">Current Exercise</span>
            <h2 className="text-2xl font-bold text-[#e5e2e1] mt-1">Incline DB Press</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="px-2.5 py-1 bg-[#2a2a2a] rounded-lg flex items-center gap-1.5 text-xs text-[#f5c400] font-[JetBrains_Mono,monospace]">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span> 24:12
              </div>
              <div className="px-2.5 py-1 bg-[#2a2a2a] rounded-lg flex items-center gap-1.5 text-xs text-[#f5c400] font-[JetBrains_Mono,monospace]">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span> 320 kcal
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold uppercase text-[#d1c5ab] mb-1">Intensity Target</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-6 rounded-full bg-[#f5c400]" />)}
              {[4, 5].map(i => <div key={i} className="w-1.5 h-6 rounded-full bg-[#353534]" />)}
            </div>
          </div>
        </section>

        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-xl p-5 space-y-4 relative overflow-hidden"
          style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-[#d1c5ab]">Set #</label>
              <input
                type="number"
                value={setNum}
                onChange={e => setSetNum(Number(e.target.value))}
                className="bg-[#0e0e0e] border border-white/10 rounded-xl px-3 py-2.5 text-xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-[#d1c5ab]">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="bg-[#0e0e0e] border border-white/10 rounded-xl px-3 py-2.5 text-xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-[#d1c5ab]">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={e => setReps(Number(e.target.value))}
                className="bg-[#0e0e0e] border border-white/10 rounded-xl px-3 py-2.5 text-xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] outline-none"
              />
            </div>
          </div>

          {/* RPE Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-[#d1c5ab]">Intensity (RPE)</label>
              <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace] text-base">{rpe}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={rpe}
              onChange={e => setRpe(Number(e.target.value))}
              className="w-full h-2 rounded-full cursor-pointer accent-[#f5c400]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSaveSet} className="flex-1 bg-[#f5c400] text-black font-bold py-3.5 rounded-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(245,196,0,0.25)] hover:brightness-110 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-base">add_task</span> Save Set
            </button>
            <button onClick={() => navigate('/workout/session-complete')} className="flex-1 bg-transparent border border-white/10 text-[#e5e2e1] font-bold py-3.5 rounded-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-base">check_circle</span> Complete
            </button>
          </div>
        </motion.div>

        {/* AI Rec & History */}
        <div className="space-y-3">
          <div className="rounded-xl p-4 border border-[#f5c400]/20 bg-[#f5c400]/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f5c400] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <p className="text-xs text-[#d1c5ab]">
              Aim for <span className="text-[#f5c400] font-bold">42.5kg</span> next set for peak hypertrophy based on HRV.
            </p>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#d1c5ab] mb-2">Logged Sets</h3>
            <div className="space-y-2">
              {savedSets.map(s => (
                <div key={s.set} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5 font-[JetBrains_Mono,monospace]">
                  <span className="text-[#d1c5ab]">Set {s.set}</span>
                  <span className="text-[#f5c400] font-bold">{s.weight}kg × {s.reps} (RPE {s.rpe})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Notes */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#d1c5ab] block mb-2">Session Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did this exercise feel? Any adjustments made..."
            rows={2}
            className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl p-3 text-xs text-[#e5e2e1] outline-none focus:border-[#f5c400]"
          />
        </div>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
