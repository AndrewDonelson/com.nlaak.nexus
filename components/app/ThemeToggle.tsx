import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="relative w-10 h-10 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"

    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:rotate-90 dark:scale-0" />
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;