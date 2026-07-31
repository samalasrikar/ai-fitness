import { useState, useEffect, useCallback } from 'react';
import { workoutApi } from '../../../services/api/workout.api';

export function useActiveSession(workoutPlan, onSessionCompleted) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSetsMap, setCompletedSetsMap] = useState({}); // { [exIdx]: [true, false, ...] }
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [restDuration, setRestDuration] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize sets tracking array for current plan
  useEffect(() => {
    if (workoutPlan && workoutPlan.exercises) {
      const initialMap = {};
      workoutPlan.exercises.forEach((ex, idx) => {
        const numSets = Number(ex.sets) || 3;
        initialMap[idx] = new Array(numSets).fill(false);
      });
      setCompletedSetsMap(initialMap);
      setCurrentExerciseIndex(0);
    }
  }, [workoutPlan]);

  // Live stopwatch interval tick
  useEffect(() => {
    let timer = null;
    if (isActive && !isPaused) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, isPaused]);

  const startSession = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    setElapsedSeconds(0);
  }, []);

  const pauseSession = () => setIsPaused(true);
  const resumeSession = () => setIsPaused(false);

  const completeSet = (exIdx, setIdx) => {
    if (!isActive) setIsActive(true);

    const updatedExSets = [...(completedSetsMap[exIdx] || [])];
    updatedExSets[setIdx] = true;

    const newMap = { ...completedSetsMap, [exIdx]: updatedExSets };
    setCompletedSetsMap(newMap);

    // Get exercise rest time or fallback to 60s
    const exRest = workoutPlan?.exercises?.[exIdx]?.restTimeSec || 60;
    setRestDuration(exRest);
    setIsRestTimerOpen(true);
  };

  const skipExercise = () => {
    if (workoutPlan?.exercises && currentExerciseIndex < workoutPlan.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const nextExercise = () => {
    if (workoutPlan?.exercises && currentExerciseIndex < workoutPlan.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const finishSession = async () => {
    if (!workoutPlan) return null;
    setIsSubmitting(true);
    try {
      let totalVol = 0;
      const setsPayload = [];

      (workoutPlan.exercises || []).forEach((ex, exIdx) => {
        const exSets = completedSetsMap[exIdx] || [];
        exSets.forEach((isDone, setIdx) => {
          const w = Number(ex.weightKg) || 40;
          const r = parseInt(String(ex.reps), 10) || 10;
          if (isDone) {
            totalVol += w * r;
          }
          setsPayload.push({
            exerciseName: ex.name,
            setNumber: setIdx + 1,
            weightKg: w,
            reps: r,
            rpe: Number(ex.rpe) || 8.0,
            completed: Boolean(isDone),
          });
        });
      });

      const sessionDuration = Math.max(elapsedSeconds, 60);
      const calories = Math.round((sessionDuration / 60) * 8.5);

      const payload = {
        title: workoutPlan.title || 'Workout Session',
        durationSeconds: sessionDuration,
        totalVolumeKg: totalVol,
        caloriesBurned: calories,
        rpeAvg: 8.5,
        rating: 5,
        sets: setsPayload,
      };

      const res = await workoutApi.logSession(payload);
      setIsActive(false);
      if (onSessionCompleted) {
        onSessionCompleted(res.data?.data || res.data || payload);
      }
      return res.data;
    } catch (err) {
      console.error('Failed to log workout session:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isActive,
    isPaused,
    elapsedSeconds,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    completedSetsMap,
    isRestTimerOpen,
    setIsRestTimerOpen,
    restDuration,
    isSubmitting,
    startSession,
    pauseSession,
    resumeSession,
    completeSet,
    skipExercise,
    prevExercise,
    nextExercise,
    finishSession,
  };
}
