import { useState, useEffect } from 'react';

export default function SyncStatus({ isLoading, isError, lastSyncTime }) {
  const [timeAgo, setTimeAgo] = useState('Just now');

  useEffect(() => {
    if (!lastSyncTime) return;
    const updateTime = () => {
      const seconds = Math.floor((new Date() - new Date(lastSyncTime)) / 1000);
      if (seconds < 30) setTimeAgo('Just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-primary/20 animate-pulse">
        <span className="material-symbols-outlined text-[14px] text-primary animate-spin">autorenew</span>
        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Syncing...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
        <span className="material-symbols-outlined text-[14px] text-red-400">sync_problem</span>
        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Sync Failed</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-white/5">
      <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Synced {timeAgo}</span>
    </div>
  );
}
