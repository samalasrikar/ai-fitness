import { useState, useCallback } from 'react';
import { exerciseApi } from '../services/api/exercise.api';

export function useExercise() {
  const [exercises, setExercises] = useState([]);
  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExercises = useCallback(async (search = '', category = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await exerciseApi.getExercises(search, category);
      setExercises(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch exercise library');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExerciseById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await exerciseApi.getExerciseById(id);
      setExerciseDetail(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlternatives = useCallback(async (exerciseName = '') => {
    setLoading(true);
    try {
      const res = await exerciseApi.getAlternatives(exerciseName);
      setAlternatives(res.data || []);
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exercises,
    exerciseDetail,
    alternatives,
    loading,
    error,
    fetchExercises,
    fetchExerciseById,
    fetchAlternatives,
  };
}
