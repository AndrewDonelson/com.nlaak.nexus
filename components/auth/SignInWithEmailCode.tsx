"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/app/hooks/use-toast"
import { useAuthActions } from "@convex-dev/auth/react";

export function SignInWithEmailCode({
  handleCodeSent,
  provider,
  children,
}: {
  handleCodeSent: (email: string) => void;
  provider?: string;
  children?: React.ReactNode;
}) {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="flex flex-col space-y-4 animate-fade-in"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn(provider ?? "resend-otp", formData)
          .then(() => handleCodeSent(formData.get("email") as string))
          .catch((error) => {
            console.error(error);
            toast({
              title: "Could not send code",
              variant: "destructive",
            });
            setSubmitting(false);
          });
      }}
    >
      <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
      <Input 
        name="email" 
        id="email" 
        className="mb-4 animate-fade-in" 
        autoComplete="email" 
      />
      {children}
      <Button 
        type="submit" 
        disabled={submitting}
        className="w-full animate-fade-in hover:animate-pulse bg-primary text-primary-foreground"
      >
        Send code
      </Button>
    </form>
  );
}