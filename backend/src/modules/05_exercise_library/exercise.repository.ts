import { db } from '../../config/database';
import { Exercise, ExerciseAlternative } from './exercise.types';

export class ExerciseRepository {
  public async getExercises(search?: string, category?: string): Promise<Exercise[]> {
    let query = 'SELECT * FROM exercise_library WHERE 1=1';
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (LOWER(name) LIKE LOWER($${params.length}) OR LOWER(target_muscle) LIKE LOWER($${params.length}))`;
    }

    if (category && category !== 'All') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ' ORDER BY name ASC';
    const result = await db.query(query, params);
    
    if (result.rows.length === 0) {
      // Return default list if table is empty
      return DEFAULT_EXERCISES;
    }

    return result.rows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      targetMuscle: r.target_muscle,
      equipment: r.equipment,
      difficulty: r.difficulty,
      instructions: r.instructions || [],
      formCues: r.form_cues || [],
      imageUrl: r.image_url,
    }));
  }

  public async getExerciseById(id: string): Promise<Exercise | null> {
    const res = await db.query('SELECT * FROM exercise_library WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      const match = DEFAULT_EXERCISES.find(e => e.id === id || e.name.toLowerCase() === id.toLowerCase());
      return match || DEFAULT_EXERCISES[0];
    }
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      category: r.category,
      targetMuscle: r.target_muscle,
      equipment: r.equipment,
      difficulty: r.difficulty,
      instructions: r.instructions || [],
      formCues: r.form_cues || [],
      imageUrl: r.image_url,
    };
  }

  public async getAlternatives(exerciseName?: string): Promise<ExerciseAlternative[]> {
    return [
      {
        id: 'alt-1',
        name: 'Pendulum Squat Machine',
        matchScore: 98,
        reason: 'Optimal quadriceps isolation with zero lumbar compression.',
        mechanicalTension: 9.4,
        fatigueImpact: 'Low CNS',
        targetMuscle: 'Quadriceps',
        equipment: 'Machine',
        imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'alt-2',
        name: 'Heels-Elevated Goblet Squat',
        matchScore: 92,
        reason: 'Maintains knee flexion angle while protecting spinal erection.',
        mechanicalTension: 8.8,
        fatigueImpact: 'Low CNS',
        targetMuscle: 'Quadriceps / Glutes',
        equipment: 'Dumbbell',
        imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'alt-3',
        name: '45-Degree Leg Press',
        matchScore: 89,
        reason: 'Allows maximum load output without balance constraint.',
        mechanicalTension: 9.1,
        fatigueImpact: 'Moderate',
        targetMuscle: 'Quadriceps',
        equipment: 'Machine',
        imgSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400',
      },
    ];
  }
}

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Barbell Back Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps, Glutes',
    equipment: 'Barbell, Rack',
    difficulty: 'Intermediate',
    instructions: [
      'Position barbell across upper traps and unrack carefully.',
      'Hinge at hips and bend knees until thighs are parallel to ground.',
      'Drive through heels to return to standing position.',
    ],
    formCues: [
      'Keep chest elevated throughout the movement.',
      'Maintain brace in core during axial loading.',
      'Track knees over toes.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'ex-2',
    name: 'Incline Dumbbell Bench Press',
    category: 'Chest',
    targetMuscle: 'Upper Pectoralis',
    equipment: 'Incline Bench, Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Set bench to 30-45 degree incline angle.',
      'Press dumbbells upward until arms are extended above chest.',
      'Lower under control to deep stretch position.',
    ],
    formCues: [
      'Retract scapula into bench.',
      'Keep elbows at ~45 degree angle to torso.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'ex-3',
    name: 'Romanian Deadlift',
    category: 'Legs',
    targetMuscle: 'Hamstrings, Glutes',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hold barbell at hip height with overhand grip.',
      'Push hips backward while keeping back flat until hamstrings are stretched.',
      'Contract glutes to pull torso back up.',
    ],
    formCues: [
      'Keep bar close to legs at all times.',
      'Do not round lower back.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400',
  },
];
