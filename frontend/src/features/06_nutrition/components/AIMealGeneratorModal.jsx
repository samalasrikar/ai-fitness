import { useState } from 'react';
import { motion } from 'framer-motion';
import { nutritionApi } from '../../../services/api/nutrition.api';

const GOALS = ['Muscle Gain (Hypertrophy)', 'Fat Loss & Cutting', 'Recomposition', 'Endurance Maintenance'];
const DIETS = ['High Protein', 'Balanced', 'Keto', 'Vegan', 'Vegetarian'];
const BUGETS = ['Budget Friendly', 'Standard', 'Premium / Gourmet'];
const CUISINES = ['International', 'Indian / South Asian', 'Mediterranean', 'Asian Fusion'];

export default function AIMealGeneratorModal({ isOpen, onClose, onGenerated }) {
  const [goal, setGoal] = useState(GOALS[0]);
  const [targetCalories, setTargetCalories] = useState(2400);
  const [dietPreference, setDietPreference] = useState(DIETS[0]);
  const [budget, setBudget] = useState(BUGETS[1]);
  const [cuisine, setCuisine] = useState(CUISINES[0]);
  const [allergies, setAllergies] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await nutritionApi.getRecommendations({
        goal,
        targetCalories: Number(targetCalories),
        dietPreference,
        allergies: allergies ? allergies.split(',').map((s) => s.trim()) : [],
        budget,
        cuisine,
      });
      const data = res.data?.data || res.data;
      if (onGenerated) onGenerated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'AI Meal Plan Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#1a1919] border border-[#f5c400]/30 rounded-2xl p-6 shadow-2xl space-y-4 text-[#e5e2e1] my-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#f5c400]">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            <h3 className="text-lg font-extrabold tracking-tight">AI MEAL PLANNER</h3>
          </div>
          <button onClick={onClose} className="text-[#d1c5ab]/60 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Primary Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#f5c400] outline-none"
            >
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Target Calories</label>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-[#f5c400]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Diet Type</label>
              <select
                value={dietPreference}
                onChange={(e) => setDietPreference(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#f5c400] outline-none"
              >
                {DIETS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none"
              >
                {BUGETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Cuisine</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none"
              >
                {CUISINES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Allergies / Restrictions</label>
            <input
              type="text"
              placeholder="e.g. Peanuts, Dairy (optional)"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#f5c400]"
            />
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#262525] text-[#d1c5ab] rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#f5c400] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(245,196,0,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>Generate Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
