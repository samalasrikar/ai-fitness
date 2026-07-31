import { AIGenerateWorkoutInput, WorkoutPlan, ExerciseItem } from '../workout.types';
import { AIService } from '../../../utils/ai.service';

export class WorkoutGeneratorService {
  public static async generateWorkout(input: AIGenerateWorkoutInput): Promise<WorkoutPlan> {
    const goal = input.goal || 'Hypertrophy';
    const targetMuscle = input.targetMuscle || 'Full Body';
    const duration = input.workoutDuration || 45;
    const experience = input.experience || 'Intermediate';
    const equipmentList = Array.isArray(input.equipment) && input.equipment.length > 0
      ? input.equipment.join(', ')
      : 'Dumbbell, Barbell, Machine';

    // Attempt AI Service call if available, or generate algorithmic structured routine
    try {
      const aiPlan = await AIService.generateWorkoutPlanWithAI({
        focusArea: `${goal} - ${targetMuscle}`,
        targetDuration: typeof duration === 'number' ? duration : parseInt(String(duration), 10) || 45,
      });

      if (aiPlan && aiPlan.exercises && aiPlan.exercises.length > 0) {
        return {
          title: aiPlan.title || `${targetMuscle} ${goal} Protocol`,
          muscleGroup: targetMuscle,
          duration: `${duration} mins`,
          estimatedCalories: Math.round(Number(duration) * 8.5),
          exercises: aiPlan.exercises.map((ex: any) => ({
            name: ex.name,
            sets: ex.sets || 4,
            reps: String(ex.reps || '8-12'),
            weightKg: ex.weightKg || 60,
            restTimeSec: ex.restTimeSec || 60,
            equipment: ex.equipment || equipmentList.split(',')[0] || 'Barbell',
            targetMuscle: targetMuscle,
            rpe: ex.rpe || 8,
            tempo: ex.tempo || '2-0-2',
            instructions: ex.instructions || 'Perform movement with strict control and full range of motion.',
            tag: 'AI OPTIMIZED',
            tagColor: 'bg-primary text-black',
            imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
          })),
        };
      }
    } catch {
      // Fallback to rule-based generator
    }

    const fallbackExercises: Record<string, ExerciseItem[]> = {
      Chest: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', weightKg: 80, restTimeSec: 90, equipment: 'Barbell', targetMuscle: 'Chest', rpe: 8, tempo: '3-0-1', instructions: 'Drive feet into ground and press up explosive.', imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weightKg: 28, restTimeSec: 60, equipment: 'Dumbbell', targetMuscle: 'Upper Chest', rpe: 8.5, tempo: '2-1-1', instructions: 'Squeeze at top of movement.', imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' },
        { name: 'Cable Chest Flyes', sets: 3, reps: '12-15', weightKg: 15, restTimeSec: 45, equipment: 'Cable', targetMuscle: 'Inner Chest', rpe: 9, tempo: '2-0-2', instructions: 'Maintain slight elbow bend throughout.', imgSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400' },
      ],
      Back: [
        { name: 'Barbell Lat Pulldown / Pullups', sets: 4, reps: '8-10', weightKg: 70, restTimeSec: 90, equipment: 'Cable/Bodyweight', targetMuscle: 'Lats', rpe: 8, tempo: '2-0-2', instructions: 'Pull with elbows down to hips.', imgSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400' },
        { name: 'Bent-Over Barbell Row', sets: 4, reps: '8-10', weightKg: 75, restTimeSec: 90, equipment: 'Barbell', targetMuscle: 'Rhomboids/Upper Back', rpe: 8.5, tempo: '2-1-1', instructions: 'Hinge at hips, pull bar to navel.', imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400' },
        { name: 'Seated Cable Row', sets: 3, reps: '10-12', weightKg: 65, restTimeSec: 60, equipment: 'Cable', targetMuscle: 'Mid Back', rpe: 9, tempo: '2-0-2', instructions: 'Retract shoulder blades.', imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' },
      ],
      Legs: [
        { name: 'Barbell Back Squat', sets: 4, reps: '6-8', weightKg: 100, restTimeSec: 120, equipment: 'Barbell', targetMuscle: 'Quadriceps / Glutes', rpe: 8.5, tempo: '3-1-1', instructions: 'Squat below parallel, keep chest up.', imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400' },
        { name: 'Romanian Deadlift', sets: 4, reps: '8-10', weightKg: 85, restTimeSec: 90, equipment: 'Barbell', targetMuscle: 'Hamstrings / Glutes', rpe: 8, tempo: '3-0-1', instructions: 'Hinge back with hips, feel hamstring stretch.', imgSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400' },
        { name: 'Leg Extension', sets: 3, reps: '12-15', weightKg: 50, restTimeSec: 60, equipment: 'Machine', targetMuscle: 'Quadriceps', rpe: 9, tempo: '2-1-2', instructions: 'Hold peak contraction for 1 second.', imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' },
      ],
    };

    const selectedExercises = fallbackExercises[targetMuscle] || [
      ...fallbackExercises['Chest'].slice(0, 2),
      ...fallbackExercises['Legs'].slice(0, 2),
    ];

    return {
      title: `${targetMuscle} ${goal} (${experience})`,
      muscleGroup: targetMuscle,
      duration: `${duration} mins`,
      estimatedCalories: Math.round(Number(duration) * 8.5),
      exercises: selectedExercises,
    };
  }
}
