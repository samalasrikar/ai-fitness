import { useState, useEffect, useCallback } from 'react';
import { workoutApi } from '../../../services/api/workout.api';
import { DAYS_LIST } from '../utils/workout.utils';

export function useWorkout() {
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const initialDay = DAYS_LIST.includes(todayName) ? todayName : 'Monday';

  const [activeDay, setActiveDay] = useState(initialDay);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkoutForDay = useCallback(async (dayName) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await workoutApi.getDailyWorkout(dayName);
      const data = res.data?.data || res.data;
      setCurrentPlan(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load workout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkoutForDay(activeDay);
  }, [activeDay, fetchWorkoutForDay]);

  const selectPreviousDay = () => {
    const idx = DAYS_LIST.indexOf(activeDay);
    const prevIdx = (idx - 1 + DAYS_LIST.length) % DAYS_LIST.length;
    setActiveDay(DAYS_LIST[prevIdx]);
  };

  const selectNextDay = () => {
    const idx = DAYS_LIST.indexOf(activeDay);
    const nextIdx = (idx + 1) % DAYS_LIST.length;
    setActiveDay(DAYS_LIST[nextIdx]);
  };

  return {
    activeDay,
    setActiveDay,
    selectPreviousDay,
    selectNextDay,
    currentPlan,
    setCurrentPlan,
    isLoading,
    error,
    refreshWorkout: () => fetchWorkoutForDay(activeDay),
  };
}
