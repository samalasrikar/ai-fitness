import { Suspense } from 'react';

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      {message && <p className="text-sm text-muted-foreground animate-pulse">{message}</p>}
    </div>
  );
}

export function LoadingBoundary({ children, fallbackMessage }) {
  return (
    <Suspense fallback={<LoadingSpinner message={fallbackMessage} />}>
      {children}
    </Suspense>
  );
}
