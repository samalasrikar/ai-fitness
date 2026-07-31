export interface ExerciseItem {
  name: string;
  sets: number | string;
  reps?: string;
  weightKg?: number;
  restTimeSec?: number;
  equipment?: string;
  targetMuscle?: string;
  rpe?: number | string;
  tempo?: string;
  instructions?: string;
  extra?: string;
  tag?: string | null;
  tagColor?: string;
  note?: string;
  imgSrc?: string;
  imgAlt?: string;
}

export interface WorkoutPlan {
  id?: string;
  userId?: string;
  title: string;
  muscleGroup?: string;
  duration: string;
  estimatedCalories?: number;
  exercises: ExerciseItem[];
  isActive?: boolean;
  createdAt?: Date;
  dayName?: string;
}

export interface SessionSet {
  id?: string;
  sessionId?: string;
  exerciseName: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  rpe?: number;
  completed?: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  title: string;
  durationSeconds: number;
  totalVolumeKg: number;
  caloriesBurned: number;
  rpeAvg: number;
  aiFeedback?: string;
  rating?: number;
  createdAt: Date;
  sets?: SessionSet[];
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  title: string;
  category: string;
  estimatedDurationMin: number;
  difficulty: string;
  exercises: ExerciseItem[];
  createdAt: Date;
}

export interface LogSessionInput {
  title: string;
  durationSeconds: number;
  totalVolumeKg?: number;
  caloriesBurned?: number;
  rpeAvg?: number;
  aiFeedback?: string;
  rating?: number;
  sets: {
    exerciseName: string;
    setNumber: number;
    weightKg: number;
    reps: number;
    rpe?: number;
    completed?: boolean;
  }[];
}

export interface CreateTemplateInput {
  title: string;
  category?: string;
  estimatedDurationMin?: number;
  difficulty?: string;
  exercises: ExerciseItem[];
}

export interface AIGenerateWorkoutInput {
  goal: string;
  targetMuscle: string;
  experience: string;
  workoutDuration: number | string;
  equipment: string[];
  trainingStyle?: string;
  intensity?: string;
  injuries?: string;
}

export interface ReplaceExerciseInput {
  currentExerciseName: string;
  targetMuscle?: string;
  equipment?: string;
  difficulty?: string;
  searchQuery?: string;
}

export interface ExerciseAlternative {
  id: string;
  name: string;
  targetMuscle: string;
  equipment: string;
  difficulty: string;
  matchScore: number;
  reason: string;
  imgSrc?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  type: string;
  reason: string;
  recommendedAction: string;
  priority: 'High' | 'Medium' | 'Low';
  createdAt?: string;
}

export interface WeeklyAnalytics {
  workoutDays: number;
  workoutTimeMin: number;
  totalCalories: number;
  totalVolumeKg: number;
  exercisesCompleted: number;
  frequencyData: { day: string; sessions: number }[];
  durationData: { day: string; minutes: number }[];
  muscleDistribution: { name: string; percentage: number }[];
  volumeTrend: { date: string; volume: number }[];
  completionPercentage: number;
  consistencyScore: number;
  personalRecords: { exercise: string; record: string; date: string }[];
}
