import { ThemeConfig } from '@/hooks/useTheme';

export const applyTheme = (theme: ThemeConfig) => {
  const root = document.documentElement;
  
  // Set CSS variables
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-background', theme.colors.background);
  root.style.setProperty('--theme-text', theme.colors.text);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  
  // Apply background
  document.body.style.background = theme.colors.background;
  document.body.style.color = theme.colors.text;
};

