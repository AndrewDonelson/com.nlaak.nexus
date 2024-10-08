import React from 'react';
import { SignInWithPassword } from "@/components/auth/SignInWithPassword";
import { Toaster } from "@/components/ui/toaster";

export function SignInFormPassword() {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-xl animate-fade-in-up">
      <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
        Sign in or create an account
      </h2>
      <SignInWithPassword />
      <Toaster />
    </div>
  );
}