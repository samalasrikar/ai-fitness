import { useState, useCallback } from 'react';
import { nutritionApi } from '../services/api/nutrition.api';

export function useNutrition() {
  const [summary, setSummary] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await nutritionApi.getSummary();
      const payload = res.data?.data ?? res.data;
      setSummary(payload);
      setMeals(payload?.meals || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load nutrition summary');
    } finally {
      setLoading(false);
    }
  }, []);

  const logMeal = async (mealData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await nutritionApi.logMeal(mealData);
      await fetchSummary();
      return res.data?.data ?? res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to log meal';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMeal = async (id) => {
    setError(null);
    try {
      await nutritionApi.deleteMeal(id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
      await fetchSummary();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete meal');
    }
  };

  const analyzeMeal = async (description) => {
    setError(null);
    try {
      const res = await nutritionApi.analyzeMeal(description);
      const payload = res.data?.data ?? res.data;
      return payload;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'AI Meal Analysis failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    summary,
    meals,
    loading,
    error,
    fetchSummary,
    logMeal,
    deleteMeal,
    analyzeMeal,
  };
}
