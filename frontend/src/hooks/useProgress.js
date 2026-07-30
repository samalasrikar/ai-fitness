import { useState, useCallback } from 'react';
import { progressApi } from '../services/api/progress.api';

export function useProgress() {
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await progressApi.getDashboard();
      setDashboardMetrics(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleChallenge = async () => {
    try {
      const res = await progressApi.toggleChallenge();
      setDashboardMetrics((prev) => (prev ? { ...prev, hasJoinedChallenge: res.data.hasJoinedChallenge } : prev));
      return res.data;
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPersonalRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await progressApi.getPersonalRecords();
      setPersonalRecords(res.data || []);
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPersonalRecord = async (recordData) => {
    setLoading(true);
    try {
      const res = await progressApi.createPersonalRecord(recordData);
      await fetchPersonalRecords();
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePersonalRecord = async (id) => {
    try {
      await progressApi.deletePersonalRecord(id);
      setPersonalRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    dashboardMetrics,
    personalRecords,
    loading,
    error,
    fetchDashboardMetrics,
    toggleChallenge,
    fetchPersonalRecords,
    createPersonalRecord,
    deletePersonalRecord,
  };
}
