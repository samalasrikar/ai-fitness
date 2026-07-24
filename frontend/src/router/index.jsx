import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '../layout/RootLayout';
import { ProtectedRoute } from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              FitAI X Architecture Ready
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Phase 1 Project Initialization & Foundation Complete. Feature implementations will occur in subsequent phases.
            </p>
          </div>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          // Protected feature routes will be registered here in future phases
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
