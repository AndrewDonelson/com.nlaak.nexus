import React from 'react';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, className }) => {
  return (
    <header className={cn('w-full py-6 px-4 bg-background text-foreground', className)}>
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">{title}</h1>
        {subtitle && (
          <p className="text-2xl text-muted-foreground text-center">{subtitle}</p>
        )}
      </div>
    </header>
  );
};

export default Header;