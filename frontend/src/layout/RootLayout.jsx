import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Global Header Placeholder */}
      <header className="border-b border-border bg-card/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-wider text-primary">FitAI X</span>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase font-mono">Phase 1</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Global Footer Placeholder */}
      <footer className="border-t border-border bg-card/30 px-6 py-4 text-center text-xs text-muted-foreground">
        FitAI X Enterprise Platform &copy; {new Date().getFullYear()} — Setup Only Foundation
      </footer>
    </div>
  );
}
