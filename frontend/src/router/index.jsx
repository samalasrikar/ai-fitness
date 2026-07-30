import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Landing, Login, Signup } from '@features/01_auth';
import { Onboarding } from '@features/03_onboarding';
import { Dashboard } from '@features/08_progress_tracking';

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
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
