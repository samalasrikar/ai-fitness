import React, { useState } from 'react';
import ManualWorkoutForm from './ManualWorkoutForm';
import AIWorkoutGeneratorForm from './AIWorkoutGeneratorForm';

export default function WorkoutBuilderModal({ isOpen, onClose, onSaveWorkout }) {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'ai'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface-container border border-white/10 rounded-[28px] max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Workout Builder</span>
            <h3 className="text-xl font-extrabold text-white">Create New Workout</h3>
          </div>

          <div className="flex bg-surface-bright p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'manual' ? 'bg-primary text-black shadow-md' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Manual Builder
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'ai' ? 'bg-primary text-black shadow-md' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              AI Generator
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'manual' ? (
          <ManualWorkoutForm onSave={(data) => { onSaveWorkout(data); onClose(); }} onCancel={onClose} />
        ) : (
          <AIWorkoutGeneratorForm onSave={(data) => { onSaveWorkout(data); onClose(); }} onCancel={onClose} />
        )}
      </div>
    </div>
  );
}
