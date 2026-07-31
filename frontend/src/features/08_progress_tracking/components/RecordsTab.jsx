import { useState, useEffect } from 'react';
import { progressApi } from '../../shared/services/progress.api';
import PersonalRecordCard from './records/PersonalRecordCard';
import AchievementCard from './records/AchievementCard';
import MilestoneCard from './records/MilestoneCard';
import AIInsightCard from './records/AIInsightCard';
import ProgressChart from './records/ProgressChart';
import StreakCard from './records/StreakCard';

export default function RecordsTab() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // PR Form dialog state
  const [showAddPrModal, setShowAddPrModal] = useState(false);
  const [newExercise, setNewExercise] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [isSubmittingPr, setIsSubmittingPr] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await progressApi.getRecordsSummary();
      const summaryData = res.data?.data || res.data;
      if (summaryData) setSummary(summaryData);
    } catch (err) {
      console.error(err);
      setError('Could not load records summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreatePr = async (e) => {
    e.preventDefault();
    if (!newExercise.trim() || !newValue) return;
    setIsSubmittingPr(true);
    try {
      await progressApi.createPersonalRecord({
        exerciseName: newExercise.trim(),
        recordValue: Number(newValue),
        unit: newUnit,
        category: 'Strength',
      });
      setShowAddPrModal(false);
      setNewExercise('');
      setNewValue('');
      await fetchRecords();
    } catch (err) {
      setError('Failed to create personal record');
    } finally {
      setIsSubmittingPr(false);
    }
  };

  const handleDeletePr = async (id) => {
    try {
      await progressApi.deletePersonalRecord(id);
      await fetchRecords();
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-in fade-in duration-300">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">autorenew</span>
        <p className="text-xs text-on-surface-variant font-medium">Loading fitness records & achievements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
        <span className="material-symbols-outlined text-red-400 text-4xl">error_outline</span>
        <p className="text-sm font-bold text-red-400">Failed to load records</p>
        <button onClick={fetchRecords} className="px-4 py-2 bg-primary text-black font-bold text-xs uppercase rounded-xl cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  const recordsList = summary?.personalRecords || [];
  const achievementsList = summary?.achievements || [];
  const milestonesList = summary?.milestones || [];
  const insightsList = summary?.aiInsights || [];
  const chartData = summary?.chartData || [];
  const streak = summary?.streak;

  const filteredRecords = categoryFilter === 'All'
    ? recordsList
    : recordsList.filter((r) => r.category?.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-6 pt-4 pb-24 animate-in fade-in duration-300">
      {/* Title Header */}
      <header className="space-y-1">
        <span className="text-label-caps text-primary uppercase tracking-[0.2em] font-bold">Performance Lab</span>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-on-surface">Records & Vault</h2>
          <button
            onClick={() => setShowAddPrModal(true)}
            className="text-[10px] font-bold text-black bg-primary px-3 py-1.5 rounded-full shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-black">add</span>
            LOG NEW PR
          </button>
        </div>
      </header>

      {/* AI Performance Insights Card */}
      <AIInsightCard insights={insightsList} />

      {/* Streak & Volume Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCard streak={streak} />
        <ProgressChart chartData={chartData} />
      </div>

      {/* Personal Best Records Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-label-caps text-on-surface uppercase tracking-wider font-extrabold">Personal Records</h3>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            {recordsList.length} PRs Logged
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 bg-[#121212] p-1 rounded-xl border border-white/5 text-[10px] font-bold max-w-xs">
          {['All', 'Strength', 'Bodyweight'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-1 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                categoryFilter === cat ? 'bg-primary text-black font-extrabold' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-surface-container p-6 rounded-2xl border border-white/5 text-center space-y-2">
            <span className="material-symbols-outlined text-on-surface-variant text-3xl">emoji_events</span>
            <p className="text-xs text-on-surface-variant font-medium">No personal records in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRecords.map((record) => (
              <PersonalRecordCard key={record.id} record={record} onDelete={handleDeletePr} />
            ))}
          </div>
        )}
      </section>

      {/* Milestones & Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestones Section */}
        <section className="space-y-3">
          <h3 className="text-label-caps text-on-surface uppercase tracking-wider font-extrabold">Active Milestones</h3>
          <div className="space-y-3">
            {milestonesList.map((m) => (
              <MilestoneCard key={m.id} milestone={m} />
            ))}
          </div>
        </section>

        {/* Achievement Vault */}
        <section className="space-y-3">
          <h3 className="text-label-caps text-on-surface uppercase tracking-wider font-extrabold">Achievement Vault</h3>
          <div className="space-y-3">
            {achievementsList.map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        </section>
      </div>

      {/* Log New PR Modal */}
      {showAddPrModal && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#161616] w-full max-w-sm rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-extrabold text-white">Log New Personal Record</h3>
              <button onClick={() => setShowAddPrModal(false)} className="text-on-surface-variant hover:text-white p-1 cursor-pointer">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePr} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                  placeholder="e.g. Barbell Squat, Overhead Press"
                  className="w-full bg-[#101010] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Record Value</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="140"
                    className="w-full bg-[#101010] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary font-[JetBrains_Mono,monospace]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Unit</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-[#101010] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="reps">reps</option>
                    <option value="mins">mins</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingPr}
                className="w-full bg-primary text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all mt-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingPr ? 'Saving Record...' : 'Save Personal Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
