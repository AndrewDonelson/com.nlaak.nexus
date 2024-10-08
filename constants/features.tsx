import React from 'react';
import { Zap, Code, Database, Shield, Palette } from 'lucide-react';
import { FeatureCardProps } from '@/components/shared/FeatureCard';

export const Features: FeatureCardProps[] = [
  {
    icon: <Zap className="h-10 w-10 text-blue-500 dark:text-blue-400" />,
    title: "Rapid Deployment",
    description: "Get your PWA up and running quickly with our pre-configured setup"
  },
  {
    icon: <Code className="h-10 w-10 text-green-500 dark:text-green-400" />,
    title: "TypeScript & Next.js",
    description: "Leverage the power of TypeScript and Next.js for robust, type-safe development"
  },
  {
    icon: <Database className="h-10 w-10 text-purple-500 dark:text-purple-400" />,
    title: "Convex Backend",
    description: "Utilize Convex as a Backend-as-a-Service for seamless data management"
  },
  {
    icon: <Shield className="h-10 w-10 text-red-500 dark:text-red-400" />,
    title: "Convex Auth",
    description: "Implement secure authentication with built-in Convex Auth support"
  },
  {
    icon: <Palette className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />,
    title: "Tailwind CSS & Animations",
    description: "Create beautiful, responsive designs with Tailwind CSS and smooth animations"
  },
  {
    icon: <Code className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />,
    title: "shadcn/ui Components",
    description: "Accelerate UI development with pre-built, customizable shadcn/ui components"
  }
];