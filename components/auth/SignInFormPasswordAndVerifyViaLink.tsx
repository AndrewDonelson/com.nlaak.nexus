"use client";
import React, { useState } from 'react';
import { SignInMethodDivider } from "@/components/auth/SignInMethodDivider";
import { SignInWithOAuth } from "@/components/auth/SignInWithOAuth";
import { SignInWithPassword } from "@/components/auth/SignInWithPassword";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

/**
 * Users choose between OAuth providers or email and password combo
 * with required email verification via a link.
 *
 * Note: This form is not showcased because it does not include
 * password reset flow, because password reset flow via magic links
 * requires routing.
 */
export function SignInFormPasswordAndVerifyViaLink() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

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
            handleSent={() => setStep("linkSent")}
            provider="password-link"
          />
        </>
      ) : (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            A verification link has been sent to your email address.
          </p>
          <Button
            className="p-0 self-start animate-fade-in hover:animate-pulse"
            variant="link"
            onClick={() => setStep("signIn")}
          >
            Cancel
          </Button>
        </>
      )}
      <Toaster />
    </div>
  );
}