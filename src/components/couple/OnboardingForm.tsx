"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FeatureCard,
  FeatureCardDescription,
  FeatureCardTitle,
} from "@/components/ui/feature-card";
import { createCouple, joinCouple } from "@/lib/actions/couple-actions";
import { toast } from "@/lib/toast";

export function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <form
        action={() => {
          setCreateError(null);
          startTransition(async () => {
            try {
              await createCouple();
            } catch {
              setCreateError("Unable to create your couple space. Please try again.");
              toast.error("Unable to create your couple space");
            }
          });
        }}
      >
        <FeatureCard variant="peach" className="cursor-pointer transition-transform duration-150 ease-out can-hover:hover:scale-[1.01] active:scale-[0.97]">
          <FeatureCardTitle>Create my couple space</FeatureCardTitle>
          <FeatureCardDescription>
            Generate a 6-digit code to share with your partner.
          </FeatureCardDescription>
          {createError ? (
            <p className="mt-3 text-sm text-destructive">{createError}</p>
          ) : null}
          <Button type="submit" variant="on-color" className="mt-4" disabled={pending}>
            Get started
          </Button>
        </FeatureCard>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-hairline" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-caption-uppercase text-muted-foreground">
            or
          </span>
        </div>
      </div>

      <FeatureCard variant="lavender">
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              const result = await joinCouple(formData);
              if (result?.error) setError(result.error);
            });
          }}
          className="space-y-4"
        >
          <FeatureCardTitle>Join my partner</FeatureCardTitle>
          <FeatureCardDescription>
            Enter the 6-digit code shared by your partner.
          </FeatureCardDescription>
          <div className="space-y-2">
            <Label htmlFor="inviteCode" className="sr-only">
              Invite code
            </Label>
            <Input
              id="inviteCode"
              name="inviteCode"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="123456"
              className="h-14 bg-background text-center text-2xl tracking-[0.3em]"
              required
            />
          </div>
          {error ? (
            <p className="text-center text-sm text-destructive">{error}</p>
          ) : null}
          <Button
            type="submit"
            variant="on-color"
            className="w-full"
            disabled={pending}
          >
            Join
          </Button>
        </form>
      </FeatureCard>
    </div>
  );
}
