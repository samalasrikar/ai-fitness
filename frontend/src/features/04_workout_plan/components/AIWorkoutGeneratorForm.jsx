import React, { useState } from 'react';
import { workoutApi } from '../../../services/api/workout.api';

export default function AIWorkoutGeneratorForm({ onSave, onCancel }) {
  const [goal, setGoal] = useState('Hypertrophy');
  const [targetMuscle, setTargetMuscle] = useState('Chest');
  const [experience, setExperience] = useState('Intermediate');
  const [duration, setDuration] = useState('45');
  const [equipment, setEquipment] = useState(['Barbell', 'Dumbbell']);
  const [trainingStyle, setTrainingStyle] = useState('Bodybuilding');
  const [intensity, setIntensity] = useState('High');
  const [injuries, setInjuries] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState(null);

  const toggleEquipment = (item) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await workoutApi.generateAIWorkout({
        goal,
        targetMuscle,
        experience,
        workoutDuration: duration,
        equipment,
        trainingStyle,
        intensity,
        injuries,
      });
      const plan = res.data?.data || res.data;
      setGeneratedWorkout(plan);
    } catch (err) {
      alert('Failed to generate AI workout: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGenerated = () => {
    if (generatedWorkout && onSave) {
      onSave(generatedWorkout);
    }
  };

  return (
    <div className="space-y-6">
      {!generatedWorkout ? (
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Goal *</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-surface-bright border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
              >
                <option value="Hypertrophy">Hypertrophy (Muscle Growth)</option>
                <option value="Strength">Maximal Strength</option>
                <option value="Fat Loss">Fat Loss & Conditioning</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Target Muscle *</label>
              <select
                value={targetMuscle}
                onChange={(e) => setTargetMuscle(e.target.value)}
                className="w-full bg-surface-bright border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
              >
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Legs">Legs</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Arms">Arms</option>
                <option value="Full Body">Full Body</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-surface-bright border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Duration (mins)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-surface-bright border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
          </div>

          {/* Equipment Selector */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase">Available Equipment</label>
            <div className="flex flex-wrap gap-2">
              {['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Kettlebell', 'Bodyweight'].map((item) => {
                const isSelected = equipment.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleEquipment(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-surface-bright border-white/10 text-on-surface-variant hover:border-white/20'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Injuries / Notes */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Injuries or Limitations (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Lower back pain, left shoulder impingement"
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              className="w-full bg-surface-bright border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-on-surface-variant hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-primary text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,196,0,0.3)] hover:brightness-110 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Generating AI Workout...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  Generate AI Routine
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Preview & Pre-Save Editing View */
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-primary uppercase">Generated Preview</span>
              <h3 className="text-base font-extrabold text-white">{generatedWorkout.title}</h3>
              <p className="text-xs text-on-surface-variant">{generatedWorkout.duration} • {generatedWorkout.exercises?.length || 0} exercises</p>
            </div>
            <button
              onClick={() => setGeneratedWorkout(null)}
              className="text-xs text-primary underline font-bold cursor-pointer"
            >
              Re-generate
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {generatedWorkout.exercises?.map((ex, idx) => (
              <div key={idx} className="p-3 bg-surface-bright rounded-xl border border-white/10 flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-white">{ex.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{ex.sets} sets • {ex.reps} reps • {ex.equipment || 'Dumbbell'}</p>
                </div>
                <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full uppercase">RPE {ex.rpe || 8}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => setGeneratedWorkout(null)}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-on-surface-variant hover:text-white cursor-pointer"
            >
              Edit Inputs
            </button>
            <button
              onClick={handleSaveGenerated}
              className="px-6 py-2.5 rounded-xl bg-primary text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,196,0,0.3)] hover:brightness-110 cursor-pointer"
            >
              Save to Routine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
