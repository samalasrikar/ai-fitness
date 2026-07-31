import React, { useState } from 'react';
import {
  TodayWorkoutScreen,
  WorkoutBuilderModal,
  ActiveSessionScreen,
  ReplaceExerciseModal,
  WorkoutCompletionModal,
  WeeklyAnalyticsSection,
  AIRecommendationsSection,
  WorkoutHistorySection,
  useWorkout,
  useActiveSession,
} from '../../04_workout_plan';
import { workoutApi } from '../../../services/api/workout.api';

export default function DashboardWorkout() {
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'builder' | 'analytics' | 'recommendations' | 'history'

  const {
    activeDay,
    selectPreviousDay,
    selectNextDay,
    currentPlan,
    setCurrentPlan,
    isLoading,
    refreshWorkout,
  } = useWorkout();

  // Modals & Active Session state
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [exerciseToReplace, setExerciseToReplace] = useState(null);
  const [sessionCompletedData, setSessionCompletedData] = useState(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  const [activeSessionMode, setActiveSessionMode] = useState(false);

  const activeSession = useActiveSession(currentPlan, (completedData) => {
    setSessionCompletedData(completedData);
    setIsCompletionModalOpen(true);
    setActiveSessionMode(false);
  });

  const handleStartWorkout = () => {
    activeSession.startSession();
    setActiveSessionMode(true);
  };

  const handleSaveWorkoutFromBuilder = async (workoutData) => {
    try {
      const res = await workoutApi.createManualPlan(workoutData);
      const newPlan = res.data?.data || res.data;
      setCurrentPlan(newPlan);
      setIsBuilderOpen(false);
      setActiveTab('today');
    } catch (err) {
      alert('Error saving workout: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleConfirmReplace = (replacementAlt) => {
    if (!currentPlan || !exerciseToReplace) return;
    const updatedExercises = (currentPlan.exercises || []).map((ex) => {
      if (ex.name === exerciseToReplace.name) {
        return {
          ...ex,
          name: replacementAlt.name,
          equipment: replacementAlt.equipment,
          targetMuscle: replacementAlt.targetMuscle,
          tag: 'REPLACED',
          tagColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        };
      }
      return ex;
    });

    setCurrentPlan({
      ...currentPlan,
      exercises: updatedExercises,
    });
  };

  const handleReplaceExercise = (exercise) => {
    setExerciseToReplace(exercise);
    setIsReplaceModalOpen(true);
  };

  if (activeSessionMode) {
    return (
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <ActiveSessionScreen
          workoutPlan={currentPlan}
          currentExerciseIndex={activeSession.currentExerciseIndex}
          elapsedSeconds={activeSession.elapsedSeconds}
          isPaused={activeSession.isPaused}
          completedSetsMap={activeSession.completedSetsMap}
          isRestTimerOpen={activeSession.isRestTimerOpen}
          setIsRestTimerOpen={activeSession.setIsRestTimerOpen}
          restDuration={activeSession.restDuration}
          onCompleteSet={activeSession.completeSet}
          onSkipExercise={activeSession.skipExercise}
          onPrevExercise={activeSession.prevExercise}
          onNextExercise={activeSession.nextExercise}
          onPause={activeSession.pauseSession}
          onResume={activeSession.resumeSession}
          onReplaceCurrent={handleReplaceExercise}
          onFinishSession={activeSession.finishSession}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">FITAI X TRAINING</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Workout Experience</h1>
        </div>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="px-3.5 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-extrabold rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span className="hidden xs:inline">Workout Builder</span>
        </button>
      </div>

      {/* Horizontal Scrollable Pill Navigation Bar */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center bg-surface-container/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 gap-1.5 min-w-max">
          {[
            { id: 'today', label: "Today's Workout", icon: 'today' },
            { id: 'builder', label: 'Workout Builder', icon: 'build' },
            { id: 'analytics', label: 'Weekly Analytics', icon: 'analytics' },
            { id: 'recommendations', label: 'AI Insights', icon: 'auto_awesome' },
            { id: 'history', label: 'Workout History', icon: 'history' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'builder') {
                    setIsBuilderOpen(true);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-black shadow-[0_0_15px_rgba(245,196,0,0.35)] scale-[1.02]'
                    : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="pt-1">
        {activeTab === 'today' && (
          <TodayWorkoutScreen
            activeDay={activeDay}
            onSelectPrevDay={selectPreviousDay}
            onSelectNextDay={selectNextDay}
            workoutPlan={currentPlan}
            isLoading={isLoading}
            onStartWorkout={handleStartWorkout}
            onOpenBuilder={() => setIsBuilderOpen(true)}
            onReplaceExercise={handleReplaceExercise}
            completedExercises={activeSession.completedSetsMap}
          />
        )}

        {activeTab === 'analytics' && <WeeklyAnalyticsSection />}

        {activeTab === 'recommendations' && <AIRecommendationsSection />}

        {activeTab === 'history' && <WorkoutHistorySection />}
      </div>

      {/* Workout Builder Modal */}
      <WorkoutBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSaveWorkout={handleSaveWorkoutFromBuilder}
      />

      {/* Replace Exercise Modal */}
      <ReplaceExerciseModal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        exerciseToReplace={exerciseToReplace}
        onConfirmReplace={handleConfirmReplace}
      />

      {/* Workout Completion Modal */}
      <WorkoutCompletionModal
        isOpen={isCompletionModalOpen}
        sessionSummary={sessionCompletedData}
        onClose={() => setIsCompletionModalOpen(false)}
        onReturnDashboard={() => {
          setIsCompletionModalOpen(false);
          setActiveTab('today');
          refreshWorkout();
        }}
      />
    </div>
  );
}
