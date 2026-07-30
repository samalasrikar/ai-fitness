export interface ExerciseItem {
  name: string;
  sets: number | string;
  reps?: string;
  rpe?: number | string;
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
  duration: string;
  exercises: ExerciseItem[];
  isActive?: boolean;
  createdAt?: Date;
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
