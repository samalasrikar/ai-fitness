import { AppProviders } from './providers';
import { AppRouter } from './router';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <div className="h-[100dvh] w-full bg-[#050505] text-on-surface font-body-md flex justify-center items-center relative overflow-hidden">
          <div className="w-full max-w-[430px] h-[100dvh] bg-[#0A0A0A] relative flex flex-col overflow-hidden shadow-2xl border-x border-white/5">
            <AppRouter />
          </div>
        </div>
      </AppProviders>
    </ErrorBoundary>
  );
}
