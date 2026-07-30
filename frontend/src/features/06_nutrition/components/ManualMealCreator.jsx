import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ManualMealCreator({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title || title.trim() === '') {
      setError('Food / Meal Title is required.');
      return;
    }
    if (!mealType || mealType.trim() === '') {
      setError('Meal Category is required.');
      return;
    }
    if (calories === '' || isNaN(Number(calories))) {
      setError('Calories value is required.');
      return;
    }
    if (protein === '' || isNaN(Number(protein))) {
      setError('Protein value is required.');
      return;
    }
    if (carbs === '' || isNaN(Number(carbs))) {
      setError('Carbs value is required.');
      return;
    }
    if (fat === '' || isNaN(Number(fat))) {
      setError('Fat value is required.');
      return;
    }

    onSave({
      title: title.trim(),
      mealType,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-[#1a1919] border border-[#f5c400]/30 rounded-2xl p-6 shadow-2xl space-y-4 text-[#e5e2e1]"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#f5c400]">Log Meal Manually</h3>
          <button onClick={onClose} className="text-[#d1c5ab]/60 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Food / Meal Title *</label>
            <input
              type="text"
              placeholder="e.g. Chicken Rice Bowl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#f5c400]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d1c5ab]">Meal Category *</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#f5c400] outline-none"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#d1c5ab]/60">Calories (kcal) *</span>
              <input
                type="number"
                placeholder="e.g. 450"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-[#f5c400]"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#d1c5ab]/60">Protein (g) *</span>
              <input
                type="number"
                placeholder="e.g. 35"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-400"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#d1c5ab]/60">Carbs (g) *</span>
              <input
                type="number"
                placeholder="e.g. 45"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-amber-400"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#d1c5ab]/60">Fat (g) *</span>
              <input
                type="number"
                placeholder="e.g. 12"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-rose-400"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#262525] text-[#d1c5ab] rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#f5c400] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(245,196,0,0.3)]"
            >
              Add Meal
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
