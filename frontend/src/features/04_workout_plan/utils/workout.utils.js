export const DAYS_LIST = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function getFormattedDayDate(dayName, offsetDays = 0) {
  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // Monday = 0
  const targetDayIndex = DAYS_LIST.indexOf(dayName);
  
  const diff = targetDayIndex - currentDayIndex + (offsetDays * 7);
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);

  const formattedDate = targetDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

  return `${dayName}, ${formattedDate}`;
}

export function formatStopwatchTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function calculateTotalVolumeKg(exercises = []) {
  return exercises.reduce((sum, ex) => {
    const sets = Number(ex.sets) || 1;
    const reps = parseInt(String(ex.reps), 10) || 10;
    const weight = Number(ex.weightKg) || 0;
    return sum + sets * reps * weight;
  }, 0);
}
