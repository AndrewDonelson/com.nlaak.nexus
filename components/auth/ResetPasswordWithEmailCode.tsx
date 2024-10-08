import React, { useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { CodeInput } from "@/components/auth/CodeInput";
import { SignInWithEmailCode } from "@/components/auth/SignInWithEmailCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/app/hooks/use-toast"

export function ResetPasswordWithEmailCode({
  handleCancel,
  provider,
}: {
  handleCancel: () => void;
  provider: string;
}) {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-background rounded-lg shadow-xl animate-fade-in-up">
      {step === "forgot" ? (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Send password reset code
          </h2>
          <SignInWithEmailCode
            handleCodeSent={(email) => setStep({ email })}
            provider={provider}
          >
            <input name="flow" type="hidden" value="reset" />
          </SignInWithEmailCode>
          <Button 
            type="button" 
            variant="link" 
            onClick={handleCancel}
            className="mt-4 animate-fade-in"
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <h2 className="font-semibold text-2xl tracking-tight mb-4 text-foreground">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Enter the 8-digit code we sent to your email address and choose a new password.
          </p>
          <form
            className="flex flex-col space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitting(true);
              const formData = new FormData(event.currentTarget);
              signIn(provider, formData).catch((error) => {
                console.error(error);
                toast({
                  title: "Code could not be verified or new password is too short, try again",
                  variant: "destructive",
                });
                setSubmitting(false);
              });
            }}
          >
            <label htmlFor="email" className="text-sm font-medium text-foreground">Code</label>
            <CodeInput />
            <label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</label>
            <Input
              type="password"
              name="newPassword"
              id="newPassword"
              className="mb-4 animate-fade-in"
              autoComplete="new-password"
            />
            <input type="hidden" name="flow" value="reset-verification" />
            <input type="hidden" name="email" value={step.email} />
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full animate-fade-in bg-primary text-primary-foreground"
            >
              Continue
            </Button>
            <Button 
              type="button" 
              variant="link" 
              onClick={() => setStep("forgot")}
              className="animate-fade-in"
            >
              Cancel
            </Button>
          </form>
        </>
      )}
    </div>
  );
}