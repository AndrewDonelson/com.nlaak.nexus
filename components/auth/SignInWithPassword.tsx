"use client";
import React, { useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/app/hooks/use-toast"

export function SignInWithPassword({
  provider,
  handleSent,
  handlePasswordReset,
}: {
  provider?: string;
  handleSent?: (email: string) => void;
  handlePasswordReset?: () => void;
}) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="flex justify-center items-center px-4 pt-8">
      <div className="w-full max-w-md">
        <form
          className="flex flex-col space-y-4 animate-fade-in bg-card p-6 rounded-lg shadow-md"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitting(true);
            const formData = new FormData(event.currentTarget);
            signIn(provider ?? "password", formData)
              .then(() => {
                handleSent?.(formData.get("email") as string);
              })
              .catch((error) => {
                console.error(error);
                const title =
                  flow === "signIn"
                    ? "Could not sign in, did you mean to sign up?"
                    : "Could not sign up, did you mean to sign in?";
                toast({ title, variant: "destructive" });
                setSubmitting(false);
              });
          }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
            {flow === "signIn" ? "Sign In" : "Sign Up"}
          </h2>
          
          <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
          <Input 
            name="email" 
            id="email" 
            className="mb-4 animate-fade-in" 
            autoComplete="email" 
          />
          
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            {handlePasswordReset && flow === "signIn" ? (
              <Button
                className="p-0 h-auto text-xs animate-fade-in"
                type="button"
                variant="link"
                onClick={handlePasswordReset}
              >
                Forgot your password?
              </Button>
            ) : null}
          </div>
          <Input
            type="password"
            name="password"
            id="password"
            className="mb-4 animate-fade-in"
            autoComplete={flow === "signIn" ? "current-password" : "new-password"}
          />
          <input name="flow" value={flow} type="hidden" />
          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full animate-fade-in hover:animate-pulse bg-primary text-primary-foreground border-primary"
          >
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
            }}
            className="text-xs animate-fade-in w-full"
          >
            {flow === "signIn"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}