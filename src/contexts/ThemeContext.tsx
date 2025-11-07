import { createContext, ReactNode } from 'react';

// Simple context that doesn't expose any theme switching
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always use dark theme
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }

  return (
    <ThemeContext.Provider value={undefined}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return {}; // Return empty object for compatibility
}
