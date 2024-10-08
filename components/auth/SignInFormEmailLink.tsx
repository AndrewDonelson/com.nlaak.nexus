"use client";
import React, { useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { SignInMethodDivider } from "@/components/auth/SignInMethodDivider";
import { SignInWithOAuth } from "@/components/auth/SignInWithOAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/app/hooks/use-toast"

export function SignInFormEmailLink() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-xl animate-fade-in-up">
      {step === "signIn" ? (
        <>
          <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} />
        </>
      ) : (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            A sign-in link has been sent to your email address.
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

function SignInWithMagicLink({
  handleLinkSent,
}: {
  handleLinkSent: () => void;
}) {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn("resend", formData)
          .then(handleLinkSent)
          .catch((error) => {
            console.error(error);
            toast({
              title: "Could not send sign-in link",
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
      <Button 
        type="submit" 
        disabled={submitting}
        className="w-full animate-fade-in hover:animate-pulse bg-primary text-primary-foreground"
      >
        Send sign-in link
      </Button>
    </form>
  );
}