import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useWorkout } from '../../../hooks/useWorkout';

export default function TrainingVault() {
  const navigate = useNavigate();
  const { templates, loading, error, fetchTemplates, createTemplate, deleteTemplate } = useWorkout();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Upper Body');

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreate = async () => {
    if (!newTitle) return;
    try {
      await createTemplate({
        title: newTitle,
        category: newCategory,
        estimatedDurationMin: 50,
        difficulty: 'Intermediate',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rpe: 8.5 },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10', rpe: 8 },
        ],
      });
      setShowCreateModal(false);
      setNewTitle('');
    } catch (_) {}
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <button onClick={() => navigate(-1)} className="text-[#f5c400] hover:opacity-80 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">TRAINING VAULT</h1>
          <button onClick={() => navigate('/dashboard')} className="text-[#f5c400] hover:opacity-80 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6 max-w-[430px] mx-auto w-full">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-[#e5e2e1]">Saved Routines</h2>
            <p className="text-xs text-[#d1c5ab]">Custom templates & AI blueprints</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#f5c400] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-105 transition-all cursor-pointer"
          >
            + Create
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <span className="material-symbols-outlined text-[#f5c400] text-xl animate-spin">autorenew</span>
            <span className="text-xs text-[#d1c5ab]">Loading vault routines...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Template Cards */}
        <div className="space-y-4">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="p-5 rounded-xl border border-white/10 bg-[#201f1f] space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-wider">{tpl.category}</span>
                  <h3 className="text-lg font-bold text-[#e5e2e1]">{tpl.title}</h3>
                </div>
                <button
                  onClick={() => deleteTemplate(tpl.id)}
                  className="text-[#d1c5ab]/40 hover:text-red-400 transition-colors text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#d1c5ab] font-[JetBrains_Mono,monospace]">
                <span>Est: {tpl.estimatedDurationMin}m</span>
                <span>•</span>
                <span>{tpl.exercises?.length || 3} Exercises</span>
                <span>•</span>
                <span>{tpl.difficulty}</span>
              </div>

              <button
                onClick={() => navigate('/workout/in-progress', { state: { plan: tpl } })}
                className="w-full py-3 bg-[#f5c400]/10 hover:bg-[#f5c400]/20 border border-[#f5c400]/20 text-[#f5c400] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Launch Routine
              </button>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-[#201f1f] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-[#f5c400]">Create Vault Template</h3>
              <div>
                <label className="text-[10px] font-bold text-[#d1c5ab] uppercase tracking-wider block mb-1">Routine Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chest & Triceps Hypertrophy"
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#e5e2e1] outline-none focus:border-[#f5c400]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#d1c5ab] uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#e5e2e1] outline-none focus:border-[#f5c400]"
                >
                  <option value="Upper Body">Upper Body</option>
                  <option value="Lower Body">Lower Body</option>
                  <option value="Push">Push</option>
                  <option value="Pull">Pull</option>
                  <option value="Legs">Legs</option>
                  <option value="Full Body">Full Body</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-[#d1c5ab] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 py-3 bg-[#f5c400] text-black font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save Routine
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
