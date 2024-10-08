import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export function SignInFormAnonymous() {
  const { signIn } = useAuthActions();

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-xl animate-fade-in-up">
      <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
        Sign in anonymously
      </h2>
      <Button
        type="submit"
        onClick={() => {
          void signIn("anonymous");
        }}
        className="w-full animate-fade-in hover:animate-pulse bg-primary text-primary-foreground"
      >
        Sign in
      </Button>
    </div>
  );
}