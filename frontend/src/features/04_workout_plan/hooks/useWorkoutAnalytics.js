import { useState, useEffect } from 'react';
import { workoutApi } from '../../../services/api/workout.api';

export function useWorkoutAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    workoutApi
      .getWeeklyAnalytics()
      .then((res) => {
        if (mounted) {
          setAnalytics(res.data?.data || res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { analytics, isLoading, error };
}
