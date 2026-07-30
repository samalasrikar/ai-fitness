export default function WorkoutTab() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
      </div>
      <h2 className="text-xl font-bold">Training Program</h2>
      <p className="text-xs text-on-surface-variant max-w-[240px]">
        Your AI Coach is tracking your volume load. Lock in a daily routine from the home tab to start recording sets.
      </p>
    </div>
  );
}
