'use client'
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/app/ThemeToggle';
import { UserMenu } from '@/components/app/UserMenu';
import { ThemeAwareLayoutProps } from '@/props';
import Image from 'next/image';
import Link from 'next/link';

export default function ThemeAwareLayout({ children }: ThemeAwareLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen relative">
        <header className="fixed top-0 left-0 right-0 z-50 h-16 flex justify-between items-start">
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent backdrop-blur-sm"></div>
          <div className="relative z-10 p-4">
            <Link href="/" className="block">
              <Image
                src="/icons/android-chrome-192x192.png"
                alt="Nlaak Studios Logo"
                width={32}
                height={32}
              />
            </Link>
          </div>
          <div className="relative z-10 p-4 flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu>User</UserMenu>
          </div>
        </header>
        <main className="absolute top-0 left-0 right-0 bottom-0 overflow-auto">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}