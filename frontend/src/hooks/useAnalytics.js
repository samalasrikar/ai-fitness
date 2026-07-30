import { useState, useCallback } from 'react';
import { analyticsApi } from '../services/api/analytics.api';

export function useAnalytics() {
  const [overloadData, setOverloadData] = useState(null);
  const [performanceLabData, setPerformanceLabData] = useState(null);
  const [goalDriftData, setGoalDriftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverloadAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getOverloadAnalysis();
      setOverloadData(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPerformanceLab = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getPerformanceLab();
      setPerformanceLabData(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGoalDrift = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getGoalDrift();
      setGoalDriftData(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    overloadData,
    performanceLabData,
    goalDriftData,
    loading,
    error,
    fetchOverloadAnalysis,
    fetchPerformanceLab,
    fetchGoalDrift,
  };
}
