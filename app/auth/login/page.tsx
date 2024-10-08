"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { SignInWithPassword } from "@/components/auth/SignInWithPassword";
import { SignInFormEmailLink } from "@/components/auth/SignInFormEmailLink";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Authenticated, Unauthenticated } from 'convex/react';
import { NavigateTo } from '@/components/NavigateTo'; // Update this path as needed

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'email'>('password');

  return (
    <>
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
          <Card className="w-full max-w-md max-h-[60vh] animate-fade-in-up shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign In or Register</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="password" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="password" onClick={() => setLoginMethod('password')}>Password</TabsTrigger>
                  <TabsTrigger value="email" onClick={() => setLoginMethod('email')}>Email Link</TabsTrigger>
                </TabsList>
                <TabsContent value="password">
                  <SignInWithPassword />
                </TabsContent>
                <TabsContent value="email">
                  <SignInFormEmailLink />
                </TabsContent>
              </Tabs>
              
              <div className="text-center text-sm">
                <Link href="/auth/forgot-password" className="text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Unauthenticated>

      <Authenticated>
        <NavigateTo route="/" />
      </Authenticated>
    </>
  );
}