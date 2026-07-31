import { ReplaceExerciseInput, ExerciseAlternative } from '../workout.types';

export class ExerciseReplacementService {
  private static alternativesCatalog: ExerciseAlternative[] = [
    {
      id: 'alt-1',
      name: 'Pendulum Squat Machine',
      targetMuscle: 'Quadriceps',
      equipment: 'Machine',
      difficulty: 'Intermediate',
      matchScore: 98,
      reason: 'Optimal quadriceps isolation with zero lumbar compression.',
      imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'alt-2',
      name: 'Heels-Elevated Goblet Squat',
      targetMuscle: 'Quadriceps',
      equipment: 'Dumbbell',
      difficulty: 'Beginner',
      matchScore: 94,
      reason: 'Maintains upright torso and quad focus with low spinal load.',
      imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'alt-3',
      name: '45-Degree Leg Press',
      targetMuscle: 'Quadriceps',
      equipment: 'Machine',
      difficulty: 'Beginner',
      matchScore: 91,
      reason: 'Allows high mechanical tension with full back support.',
      imgSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'alt-4',
      name: 'Incline Dumbbell Bench Press',
      targetMuscle: 'Upper Chest',
      equipment: 'Dumbbell',
      difficulty: 'Intermediate',
      matchScore: 96,
      reason: 'Preserves scapular freedom and upper chest focus.',
      imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'alt-5',
      name: 'Weighted Chest Dips',
      targetMuscle: 'Lower Chest',
      equipment: 'Bodyweight',
      difficulty: 'Advanced',
      matchScore: 92,
      reason: 'High pectoral recruitment and sternal overload.',
      imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'alt-6',
      name: 'Chest Supported T-Bar Row',
      targetMuscle: 'Back',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      matchScore: 95,
      reason: 'Maximizes mid-back load while supporting lower spine.',
      imgSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'alt-7',
      name: 'Neutral Grip Lat Pulldown',
      targetMuscle: 'Lats',
      equipment: 'Cable',
      difficulty: 'Beginner',
      matchScore: 93,
      reason: 'Shoulder friendly lat stretch with smooth tension.',
      imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    },
  ];

  public static getAlternatives(input: ReplaceExerciseInput): ExerciseAlternative[] {
    let list = [...this.alternativesCatalog];

    if (input.searchQuery && input.searchQuery.trim() !== '') {
      const q = input.searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.targetMuscle.toLowerCase().includes(q) ||
          a.equipment.toLowerCase().includes(q)
      );
    }

    if (input.equipment && input.equipment !== 'All') {
      list = list.filter((a) => a.equipment.toLowerCase() === input.equipment!.toLowerCase());
    }

    if (input.difficulty && input.difficulty !== 'All') {
      list = list.filter((a) => a.difficulty.toLowerCase() === input.difficulty!.toLowerCase());
    }

    return list.slice(0, 6);
  }
}
