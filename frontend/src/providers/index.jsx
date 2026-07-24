import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryProvider>
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}

export { ThemeProvider, QueryProvider };
