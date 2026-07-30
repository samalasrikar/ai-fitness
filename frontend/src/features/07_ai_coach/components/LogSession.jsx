import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useWorkout } from '../../../hooks/useWorkout';

export default function LogSession() {
  const navigate = useNavigate();
  const { logSession, loading, error } = useWorkout();

  const [title, setTitle] = useState('Manual Workout Session');
  const [exerciseName, setExerciseName] = useState('Incline DB Press');
  const [setNum, setSetNum] = useState(1);
  const [weight, setWeight] = useState(40);
  const [reps, setReps] = useState(10);
  const [rpe, setRpe] = useState(8.5);
  const [notes, setNotes] = useState('');
  const [savedSets, setSavedSets] = useState([]);

  const handleSaveSet = () => {
    setSavedSets((prev) => [...prev, { exerciseName, setNumber: setNum, weightKg: weight, reps, rpe, completed: true }]);
    setSetNum((s) => s + 1);
  };

  const handleCompleteWorkout = async () => {
    try {
      const setsToLog = savedSets.length > 0 ? savedSets : [{ exerciseName, setNumber: 1, weightKg: weight, reps, rpe, completed: true }];
      const totalVol = setsToLog.reduce((acc, s) => acc + s.weightKg * s.reps, 0);

      const session = await logSession({
        title,
        durationSeconds: 45 * 60,
        totalVolumeKg: totalVol,
        caloriesBurned: 350,
        rpeAvg: rpe,
        aiFeedback: notes || 'Manual workout session logged.',
        sets: setsToLog,
      });

      navigate('/workout/session-complete', { state: { session } });
    } catch (_) {}
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <button onClick={() => navigate(-1)} className="text-[#f5c400] hover:opacity-80 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          <button onClick={() => navigate('/dashboard')} className="text-[#f5c400] hover:opacity-80 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-5 max-w-lg mx-auto w-full">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <section className="space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">Manual Log Entry</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold text-[#e5e2e1] outline-none border-b border-white/10 pb-1 mt-1 focus:border-[#f5c400]"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-[#d1c5ab] block mb-1">Exercise Name</label>
            <input
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full bg-[#201f1f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] outline-none focus:border-[#f5c400]"
            />
          </div>
        </section>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl p-5 space-y-4 relative overflow-hidden"
          style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-[#d1c5ab]">Set #</label>
              <input
                type="number"
                value={setNum}
                onChange={(e) => setSetNum(Number(e.target.value))}
                className="bg-[#0e0e0e] border border-white/10 rounded-xl px-3 py-2.5 text-xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-[#d1c5ab]">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="bg-[#0e0e0e] border border-white/10 rounded-xl px-3 py-2.5 text-xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-[#d1c5ab]">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="bg-[#0e0e0e] border border-white/10 rounded-xl px-3 py-2.5 text-xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-[#d1c5ab]">Intensity (RPE)</label>
              <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace] text-base">{rpe}</span>
            </div>
            <input
              type="range"
              min="5"
              max="10"
              step="0.5"
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full accent-[#f5c400] cursor-pointer"
            />
          </div>

          <button
            onClick={handleSaveSet}
            className="w-full py-3 bg-[#f5c400]/10 hover:bg-[#f5c400]/20 border border-[#f5c400]/30 text-[#f5c400] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            + Add Set {setNum} To Queue
          </button>
        </motion.div>

        {/* Queued Sets Table */}
        {savedSets.length > 0 && (
          <section className="p-4 rounded-xl border border-white/10 bg-[#201f1f] space-y-2">
            <h4 className="text-xs font-bold text-[#f5c400] uppercase tracking-wider">Queued Sets ({savedSets.length})</h4>
            <div className="space-y-1">
              {savedSets.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-[JetBrains_Mono,monospace] text-[#e5e2e1] p-2 bg-[#131313] rounded-lg">
                  <span>Set #{s.setNumber}: {s.exerciseName}</span>
                  <span>{s.weightKg}kg × {s.reps} reps (RPE {s.rpe})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={handleCompleteWorkout}
          disabled={loading}
          className="w-full h-14 bg-[#f5c400] text-black font-bold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(245,196,0,0.3)] hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Saving Workout Log...' : 'Save & Log Complete Session'}
        </button>
      </main>

      <BottomNav activeId="home" />
    </div>
  );
}
