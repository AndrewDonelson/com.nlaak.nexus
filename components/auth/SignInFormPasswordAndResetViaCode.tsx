"use client";
import React, { useState } from 'react';
import { ResetPasswordWithEmailCode } from "@/components/auth/ResetPasswordWithEmailCode";
import { SignInWithPassword } from "@/components/auth/SignInWithPassword";
import { Toaster } from "@/components/ui/toaster";

/**
 * Users choose between OAuth providers or email and password combo.
 * If they forgot their password, they can reset it via OTP code
 * sent to their email.
 */
export function SignInFormPasswordAndResetViaCode() {
  const [step, setStep] = useState<"signIn" | "forgot">("signIn");

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-xl animate-fade-in-up">
      {step === "signIn" ? (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Sign in or create an account
          </h2>
          <SignInWithPassword
            provider="password-with-reset"
            handlePasswordReset={() => setStep("forgot")}
          />
        </>
      ) : (
        <ResetPasswordWithEmailCode
          provider="password-with-reset"
          handleCancel={() => setStep("signIn")}
        />
      )}
      <Toaster />
    </div>
  );
}