"use client";
import React, { useState } from 'react';
import { SignInFormEmailCode } from "@/components/auth/SignInFormEmailCode";
import { SignInFormEmailLink } from "@/components/auth/SignInFormEmailLink";
import { SignInFormPassword } from "@/components/auth/SignInFormPassword";
import { SignInFormPasswordAndResetViaCode } from "@/components/auth/SignInFormPasswordAndResetViaCode";
import { SignInFormPasswordAndVerifyViaCode } from "@/components/auth/SignInFormPasswordAndVerifyViaCode";
import { SignInFormPhoneCode } from "@/components/auth/SignInFormPhoneCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const signInMethods = [
  { name: 'Email OTP', component: SignInFormEmailCode },
  { name: 'Magic Link', component: SignInFormEmailLink },
  { name: 'Password', component: SignInFormPassword },
  { name: 'Password with Reset', component: SignInFormPasswordAndResetViaCode },
  { name: 'Password with Verification', component: SignInFormPasswordAndVerifyViaCode },
  { name: 'Phone OTP', component: SignInFormPhoneCode },
];

function SignInShowcase() {
  const [selectedMethod, setSelectedMethod] = useState(signInMethods[0]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto shadow-xl animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-2 text-foreground">Sign In or Create an Account</CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">Choose your preferred sign-in method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {signInMethods.map((method) => (
              <Button
                key={method.name}
                variant={selectedMethod.name === method.name ? "default" : "outline"}
                className="w-full text-sm py-2 animate-fade-in hover:animate-pulse"
                onClick={() => setSelectedMethod(method)}
              >
                {method.name}
              </Button>
            ))}
          </div>
          <div className="mt-6 animate-fade-in">
            {React.createElement(selectedMethod.component)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignInShowcase;