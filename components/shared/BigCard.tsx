import React from 'react';
import { cn } from '@/lib/utils';

export interface BigCardProps {
  title: string;
  description: string;
  className?: string;
}

const BigCard: React.FC<BigCardProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 text-foreground animate-fade-in-up duration-700 delay-500">
        {title}
      </h2>
      <div className="p-4 md:p-8 rounded-lg mb-4 md:mb-8 text-base md:text-xl bg-card text-card-foreground animate-fade-in duration-1000 delay-700">
        <p className="mb-4 md:mb-6 text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BigCard;