"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  className,
}) => {
  const router = useRouter();

  const handleCtaClick = () => {
    if (ctaLink) {
      router.push(ctaLink);
    }
  };

  return (
    <section className={cn(
      "py-20 px-4 sm:px-6 lg:px-8 animate-fade-in-down",
      className
    )}>
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 animate-slide-in-left">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-800 mb-8 animate-slide-in-right">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <Button
            size="lg"
            className="animate-bounce-up hover:animate-pulse transition-all duration-300"
            onClick={handleCtaClick}
          >
            {ctaText}
          </Button>
        )}
      </div>
    </section>
  );
};

export default Hero;