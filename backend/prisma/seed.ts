import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FitAI X database...');

  // Delete existing records
  await prisma.aiChat.deleteMany();
  await prisma.fitnessRecord.deleteMany();
  await prisma.nutritionLog.deleteMany();
  await prisma.workoutSessionExercise.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.userBiometrics.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Default User
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBKWOr9Ob6p48gO7Ap8ipBBhjvZx_Yu2SECOX8ZG_JOewzpBCW4CA6lLOGeiT7buA8RmIeuqdvjHZ_vSp0G_r4kNCTa2umLLTtSL9EYuaKF8MgKIPXQRMvJ5ujq8g6PZSlzW0Z8jAj7h8pgwHq861nEN9Cfx52PBOtUxldI5rsJRVwtQjIAhOKkDQgc6qII0C7jZoS6lhEGCyUma_2lKlPuU8i9ZRQ_UUQ310iQD1M0uyPsS6A1ScG5qg',
      gender: 'Male',
      age: 28,
      weight: 185,
      heightFeet: 6,
      heightInches: 1,
      experienceLevel: 'Level I',
      fitnessGoal: 'Hypertrophy',
      eliteRankScore: 750,
    },
  });

  // User Biometrics
  await prisma.userBiometrics.create({
    data: {
      userId: user.id,
      recoveryScore: 88,
      stateStatus: 'Prime State',
      hrv: 88,
      restingHeartRate: 62,
      sleepHours: '7h 45m',
      sleepQuality: 'Optimal',
      sleepChange: '+12% vs avg',
      stressLevel: 'Low',
      stressScore: 14,
      caloriesBurned: 1240,
      stepsCount: '8.4k',
      cnsReadiness: 'Peak Readiness',
    },
  });

  // Nutrition Log
  await prisma.nutritionLog.create({
    data: {
      userId: user.id,
      targetCalories: 2800,
      consumedCalories: 1950,
      proteinGrams: 142,
      targetProtein: 180,
      carbsGrams: 210,
      targetCarbs: 300,
      fatsGrams: 55,
      targetFats: 75,
    },
  });

  // Exercises
  const ex1 = await prisma.exercise.create({
    data: {
      title: 'Weighted Pull-ups',
      category: 'Back & Biceps',
      setsCount: 4,
      repsCount: '8-10 REPS',
      restSeconds: 90,
      mediaUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC_tvbaoZN5781tm0hNpTNSv5guxg8NuZDAA0721bHwF0a_vSffGfkjPUuxTSB0JVPID7kS61uY7-6DLFeGXQ-vAvGPIO31blATMeu9YNg2tf-o55dRy9GT-xCUXX7C5HmLkoRZXtwnfodfEN2MbJD53Xc-HWl_NafY5rLrfDil66qOlaxgEqg6hLyHdpP8M0f0V1Qny741yokFF-bdqnabwaU_cmw47B31MWHdorQqmgNHdwqWXSqAqw',
      isLocked: false,
    },
  });

  const ex2 = await prisma.exercise.create({
    data: {
      title: 'Bent Over Rows',
      category: 'Back & Core',
      setsCount: 3,
      repsCount: '12 REPS',
      restSeconds: 60,
      mediaUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDCAiY2r7HvGPszgVpF5c490qR9s_kUFrtqRXZhPbWRnKmHebggbg2ai4KofX86-FObtSD3ozOJq1n8yuH9AH6PiNBVXTDvLAtmgCkPNzqj0Vd92qnBrogEz_KUboZbBzvjDV8-6k9VJxDfD7MhH5tqmzGvjtIiP6oToldwpx1LgL_RD5tVkGINj34X8P4JIS_gl_d2Zvl8XqRi5PwuCkMEExNESxM3jeMxBuKoOltUBRNkeWT5F49MRA',
      isLocked: false,
    },
  });

  const ex3 = await prisma.exercise.create({
    data: {
      title: 'Face Pulls',
      category: 'Rear Delts',
      setsCount: 3,
      repsCount: '15 REPS',
      restSeconds: 45,
      mediaUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzP07Nj6lF6nd-jDewdfIm7tZFt7aPgcwxYPO85JzexIJxjNvEDYufm6eKlBmDjdaxLOP7_U1rP-CvXpA6NYa1MpidZCMlI81uiGVrf26IpVS3X6RZs4k1ZmII1I84RqFPtw6WBVNC37Op74XtxKZtM41LgUASDrYulO6G1AZBgs39gLjQrT0RfDQuu6XmWSZWvtUWIrR89ynLUkLUVrDJ5vsGu_rdXXO9hx7f8AnUVzv4mqVIWhBKQ',
      isLocked: false,
    },
  });

  const ex4 = await prisma.exercise.create({
    data: {
      title: 'Incline Curls',
      category: 'Biceps',
      setsCount: 3,
      repsCount: '12 REPS',
      restSeconds: 60,
      mediaUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCJLwGMZwAhR04EiGZauF6Zfk7XDHw4T4FAaJ9qkvFYyubqWoTUuygrLRf0Re2schc3qjGtt6qtbqPyiTLQbft5b4idMmpq8GewVT1_ZyYoyPgTB9WvVDzOOjos4WTvMU_URlOdMPniANQde0sinhKJF7hL39YuXCiEbFvzqi0Qbgvz1FAKXCgCInxtcA57Pydl4OgGPMZtENiv2PHKEymiPj0ip6_JW8DvzCJqKL3g3TYQZLJFREiHvQ',
      isLocked: true,
    },
  });

  // Workout Session
  const workoutSession = await prisma.workoutSession.create({
    data: {
      userId: user.id,
      title: 'Hypertrophy: Pull A',
      durationMinutes: 65,
      estCalories: 420,
      status: 'IN_PROGRESS',
      targetMuscles: 'Lats, Biceps, Rear Delts',
      progressPct: 33,
      completedCount: 2,
      totalCount: 6,
    },
  });

  // Workout Session Exercises
  await prisma.workoutSessionExercise.createMany({
    data: [
      { workoutSessionId: workoutSession.id, exerciseId: ex1.id, order: 1, isCompleted: true },
      { workoutSessionId: workoutSession.id, exerciseId: ex2.id, order: 2, isCompleted: true },
      { workoutSessionId: workoutSession.id, exerciseId: ex3.id, order: 3, isCompleted: false },
      { workoutSessionId: workoutSession.id, exerciseId: ex4.id, order: 4, isCompleted: false },
    ],
  });

  // Fitness Records
  await prisma.fitnessRecord.createMany({
    data: [
      {
        userId: user.id,
        title: 'Deadlift Max',
        subtitle: 'New Personal Best',
        value: '215',
        unit: 'KG',
        timeAgo: '2 DAYS AGO',
        category: 'Strength',
      },
      {
        userId: user.id,
        title: '5K Run',
        subtitle: 'Speed Improvement',
        value: '19:42',
        unit: 'MIN',
        timeAgo: 'YESTERDAY',
        category: 'Cardio',
      },
      {
        userId: user.id,
        title: '30 Day Streak',
        subtitle: 'Perfect Consistency',
        value: '30',
        unit: 'DAYS',
        timeAgo: 'JUST NOW',
        category: 'Consistency',
      },
    ],
  });

  // AI Chats
  await prisma.aiChat.createMany({
    data: [
      {
        userId: user.id,
        sender: 'FITAI_CORE',
        message: "I've analyzed your recovery score of 88. Ready for a high-intensity pull session?",
        metrics: 'HRV: 72ms | Sleep: Optimal',
      },
      {
        userId: user.id,
        sender: 'USER',
        message: 'Show me my last back and biceps stats.',
        metrics: null,
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
