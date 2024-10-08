"use client";
import React, { useState } from 'react';
import { CodeInput } from "@/components/auth/CodeInput";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/app/hooks/use-toast"

export function SignInFormPhoneCode() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | { phone: string }>("signIn");
  const { toast } = useToast();

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-xl animate-fade-in-up">
      {step === "signIn" ? (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Sign in or create an account
          </h2>
          <form
            className="flex flex-col space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              signIn("twilio", formData)
                .then(() => setStep({ phone: formData.get("phone") as string }))
                .catch((error) => {
                  console.error(error);
                  toast({
                    title: "Could not send code",
                    variant: "destructive",
                  });
                });
            }}
          >
            <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</label>
            <Input
              name="phone"
              id="phone"
              className="mb-4 animate-fade-in"
              autoComplete="tel"
            />
            <Button type="submit" className="w-full animate-fade-in hover:animate-pulse bg-primary text-primary-foreground">Send code</Button>
          </form>
        </>
      ) : (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Check your phone
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Enter the 6-digit code we sent to your phone number.
          </p>
          <form
            className="flex flex-col space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              signIn("twilio", formData).catch(() => {
                toast({
                  title: "Code could not be verified, try again",
                  variant: "destructive",
                });
              });
            }}
          >
            <label htmlFor="code" className="text-sm font-medium text-foreground">Code</label>
            <CodeInput length={6} />
            <input name="phone" value={step.phone} type="hidden" />
            <Button type="submit" className="w-full animate-fade-in hover:animate-pulse bg-primary text-primary-foreground">Continue</Button>
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