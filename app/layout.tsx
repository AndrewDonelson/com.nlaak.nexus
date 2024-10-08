import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import localFont from "next/font/local";
import "./globals.css";
import ThemeAwareLayout from '@/components/app/ThemeAwareLayout';
import { Toaster } from "@/components/ui/toaster"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/app/ConvexClientProvider";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nlaak Studios",
  description: "Crafting the Future of Software",
  applicationName: "NS-App",
  authors: [{ name: "NS-App Team" }],
  keywords: ["nlaak studios", "website", "webapp", "PWA", "small business", "low cost"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NS-App App",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "NS-App",
    title: "NS-App - Crafting the Future of Software",
    description: "Our goal is to bring the latest technologies used by tech giants such as Google, Facebook, Twitter, and Uber, just to name a few, to small businesses that cannot afford the high cost of a full leading edge development team - at a fraction of the cost. We handle everything for you from app design & development to deployment on decentralized Blockchain.",
  },
  twitter: {
    card: "summary",
    title: "NS-App - Crafting the Future of Software",
    description: "Our goal is to bring the latest technologies used by tech giants such as Google, Facebook, Twitter, and Uber, just to name a few, to small businesses that cannot afford the high cost of a full leading edge development team - at a fraction of the cost. We handle everything for you from app design & development to deployment on decentralized Blockchain.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4a90e2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>
            <ThemeAwareLayout>
              <ToastProvider>
              {children}
              </ToastProvider>
            </ThemeAwareLayout>
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
        <Toaster />
        <Script
          id="register-service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/service-worker.js');
                  });
                }

                // Detect if the app is installed
                window.isAppInstalled = false;
                window.deferredPrompt = null;

                window.addEventListener('beforeinstallprompt', (e) => {
                  e.preventDefault();
                  window.deferredPrompt = e;
                  window.isAppInstalled = false;
                });

                window.addEventListener('appinstalled', () => {
                  window.isAppInstalled = true;
                  window.deferredPrompt = null;
                });

                // Function to install the app
                window.installApp = async () => {
                  if (window.deferredPrompt) {
                    window.deferredPrompt.prompt();
                    const { outcome } = await window.deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                      window.isAppInstalled = true;
                      window.deferredPrompt = null;
                    }
                  }
                };

                // Function to uninstall the app (this is not directly possible, but we can guide the user)
                window.uninstallApp = () => {
                  if (window.isAppInstalled) {
                    alert('To uninstall the app, please go to your browser settings and remove the app from there.');
                  } else {
                    alert('The app is not currently installed.');
                  }
                };

                // Function to check if the app is installed
                window.checkAppInstalled = () => {
                  return window.isAppInstalled;
                };
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}