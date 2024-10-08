"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from "@/lib/utils";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(path => path);

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-background text-foreground py-2 px-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <Home className="h-4 w-4 mr-1" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;
          
          return (
            <React.Fragment key={path}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <li>
                <Link 
                  href={href}
                  className={cn(
                    "capitalize",
                    isLast 
                      ? "font-semibold text-foreground" 
                      : "text-muted-foreground hover:text-primary transition-colors"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {path.replace(/-/g, ' ')}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;