import { useState, useEffect, useCallback } from 'react';
import { workoutApi } from '../services/api/workout.api';

export function useWorkout() {
  const [activePlan, setActivePlan] = useState(null);
  const [homeSummary, setHomeSummary] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivePlan = useCallback(async () => {
    try {
      setLoading(true);
      const res = await workoutApi.getActivePlan();
      setActivePlan(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load workout plan');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHomeSummary = useCallback(async () => {
    try {
      setLoading(true);
      const res = await workoutApi.getHomeSummary();
      setHomeSummary(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await workoutApi.getTemplates();
      setTemplates(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await workoutApi.getHistory();
      setHistory(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logSession = async (sessionData) => {
    setLoading(true);
    try {
      const res = await workoutApi.logSession(sessionData);
      await fetchHistory();
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to log session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData) => {
    setLoading(true);
    try {
      const res = await workoutApi.createTemplate(templateData);
      await fetchTemplates();
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to create template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id) => {
    try {
      await workoutApi.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await workoutApi.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await workoutApi.generatePlan();
      setActivePlan(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    activePlan,
    homeSummary,
    templates,
    history,
    loading,
    error,
    fetchActivePlan,
    fetchHomeSummary,
    fetchTemplates,
    fetchHistory,
    logSession,
    createTemplate,
    deleteTemplate,
    deleteHistoryItem,
    generatePlan,
  };
}
