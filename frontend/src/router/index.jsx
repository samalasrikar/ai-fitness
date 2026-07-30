import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Landing, Login, Signup } from '@features/01_auth';
import { Onboarding } from '@features/03_onboarding';
import { Dashboard } from '@features/08_progress_tracking';

import {
  FitAIAssistant,
  AIAlternatives,
  InjuryGuard,
  GoalPreservation,
  OverloadAnalysis,
  WorkoutHomeDashboard,
  CreateWithAI,
  AIAnalysis,
  YourAIWorkout,
  WorkoutInProgress,
  PerformanceLab,
  SessionComplete,
  TrainingVault,
  TrainingHistory,
  LogSession,
  ExerciseIntel,
} from '@features/07_ai_coach';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/setup',
        element: <Onboarding />,
      },
      {
        path: '/onboarding',
        element: <Onboarding />,
      // Workout / AI Coach Pages
      {
        path: '/workout/home',
        element: <WorkoutHomeDashboard />,
      },
      {
        path: '/workout/assistant',
        element: <FitAIAssistant />,
      },
      {
        path: '/workout/alternatives',
        element: <AIAlternatives />,
      },
      {
        path: '/workout/injury-guard',
        element: <InjuryGuard />,
      },
      {
        path: '/workout/goal-preservation',
        element: <GoalPreservation />,
      },
      {
        path: '/workout/overload-analysis',
        element: <OverloadAnalysis />,
      },
      {
        path: '/workout/create-ai',
        element: <CreateWithAI />,
      },
      {
        path: '/workout/ai-analysis',
        element: <AIAnalysis />,
      },
      {
        path: '/workout/ai-workout',
        element: <YourAIWorkout />,
      },
      {
        path: '/workout/in-progress',
        element: <WorkoutInProgress />,
      },
      {
        path: '/workout/perf-lab',
        element: <PerformanceLab />,
      },
      {
        path: '/workout/session-complete',
        element: <SessionComplete />,
      },
      {
        path: '/workout/vault',
        element: <TrainingVault />,
      },
      {
        path: '/workout/history',
        element: <TrainingHistory />,
      },
      {
        path: '/workout/log',
        element: <LogSession />,
      },
      {
        path: '/workout/exercise-intel',
        element: <ExerciseIntel />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
