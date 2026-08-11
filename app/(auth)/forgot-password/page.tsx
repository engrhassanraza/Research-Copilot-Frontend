"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const email = new FormData(event.currentTarget).get("email") as string;
    // TODO: wire up to POST /api/v1/auth/forgot-password once the endpoint exists.
    setSubmittedEmail(email);
    setIsSubmitting(false);
  }

  if (submittedEmail) {
    return (
      <Card className="glass border-border/60">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-violet-600 dark:text-violet-300">
            <MailCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight">
              Check your email
            </h2>
            <p className="text-sm text-muted-foreground">
              We sent a password reset link to{" "}
              <span className="font-medium text-foreground">
                {submittedEmail}
              </span>
              .
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/60">
      <CardHeader className="space-y-1 pb-4 text-center">
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we will send you a link to reset it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder=""
              autoComplete="email"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Send reset link
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-medium text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
