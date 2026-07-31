import { useState, useEffect } from 'react';
import { workoutApi } from '../../../services/api/workout.api';

export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    workoutApi
      .getAIRecommendations()
      .then((res) => {
        if (mounted) {
          setRecommendations(res.data?.data || res.data || []);
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

  return { recommendations, isLoading, error };
}
