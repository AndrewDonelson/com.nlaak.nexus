"use client";
import React, { useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { CodeInput } from "@/components/auth/CodeInput";
import { ResetPasswordWithEmailCode } from "@/components/auth/ResetPasswordWithEmailCode";
import { SignInMethodDivider } from "@/components/auth/SignInMethodDivider";
import { SignInWithOAuth } from "@/components/auth/SignInWithOAuth";
import { SignInWithPassword } from "@/components/auth/SignInWithPassword";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/app/hooks/use-toast"

/**
 * Users choose between OAuth providers or email and password combo
 * with required email verification and optional password reset via OTP.
 */
export function SignInFormPasswordAndVerifyViaCode() {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [step, setStep] = useState<"signIn" | { email: string } | "forgot">("signIn");
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
          <SignInWithPassword
            handleSent={(email) => setStep({ email })}
            handlePasswordReset={() => setStep("forgot")}
            provider="password-code"
          />
        </>
      ) : step === "forgot" ? (
        <ResetPasswordWithEmailCode
          provider="password-code"
          handleCancel={() => setStep("signIn")}
        />
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
              signIn("password-code", formData).catch((error) => {
                console.error(error);
                toast({
                  title: "Code could not be verified, try again",
                  variant: "destructive",
                });
                setSubmitting(false);
              });
            }}
          >
            <label htmlFor="email" className="text-sm font-medium text-foreground">Code</label>
            <CodeInput />
            <input name="email" value={step.email} type="hidden" />
            <input name="flow" value="email-verification" type="hidden" />
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