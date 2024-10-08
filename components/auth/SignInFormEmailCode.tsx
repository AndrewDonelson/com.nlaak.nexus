"use client";
import React, { useState } from 'react';
import { CodeInput } from "@/components/auth/CodeInput";
import { SignInMethodDivider } from "@/components/auth/SignInMethodDivider";
import { SignInWithEmailCode } from "@/components/auth/SignInWithEmailCode";
import { SignInWithOAuth } from "@/components/auth/SignInWithOAuth";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/app/hooks/use-toast"
import { useAuthActions } from "@convex-dev/auth/react";

export function SignInFormEmailCode() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-xl animate-fade-in-up">
      {step === "signIn" ? (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Sign in or create an account
          </h2>
          <SignInWithOAuth />
          <SignInMethodDivider />
          <SignInWithEmailCode handleCodeSent={(email) => setStep({ email })} />
        </>
      ) : (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Enter the 8-digit code we sent to your email address.
          </p>
          <form
            className="flex flex-col space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitting(true);
              const formData = new FormData(event.currentTarget);
              signIn("resend-otp", formData).catch(() => {
                toast({
                  title: "Code could not be verified, try again",
                  variant: "destructive",
                });
                setSubmitting(false);
              });
            }}
          >
            <label htmlFor="code" className="text-sm font-medium text-foreground">Code</label>
            <CodeInput />
            <input name="email" value={step.email} type="hidden" />
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full animate-fade-in hover:animate-pulse bg-primary text-primary-foreground"
            >
              Continue
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setStep("signIn")}
              className="animate-fade-in"
            >
              Cancel
            </Button>
          </form>
        </>
      )}
      <Toaster />
    </div>
  );
}