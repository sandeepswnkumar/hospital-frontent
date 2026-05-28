import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative h-8 w-8 rounded-xl border border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-850"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
    </Button>
  );
}
