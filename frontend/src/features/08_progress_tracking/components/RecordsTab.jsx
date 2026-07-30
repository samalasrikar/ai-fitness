export default function RecordsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
      </div>
      <h2 className="text-xl font-bold">Analytics & Records</h2>
      <p className="text-xs text-on-surface-variant max-w-[240px]">
        Bio-metric analytics and progressive overload trends will render here once training sessions are completed.
      </p>
    </div>
  );
}
