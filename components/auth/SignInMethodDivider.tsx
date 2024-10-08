import React from 'react';

export function SignInMethodDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-muted-foreground/30" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-background px-2 text-xs text-muted-foreground uppercase">
          Or continue with
        </span>
      </div>
    </div>
  );
}