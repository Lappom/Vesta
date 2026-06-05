"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCouple, joinCouple } from "@/lib/actions/couple-actions";

export function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <form
        action={() => {
          startTransition(async () => {
            await createCouple();
          });
        }}
      >
        <Button
          type="submit"
          className="h-11 w-full"
          disabled={pending}
        >
          Créer mon espace couple
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-background px-2 text-muted-foreground">ou</span>
        </div>
      </div>

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
        <div className="space-y-2 text-center">
          <Label htmlFor="inviteCode" className="text-base">
            Rejoindre avec un code à 6 chiffres
          </Label>
          <Input
            id="inviteCode"
            name="inviteCode"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            placeholder="123456"
            className="h-14 text-center text-2xl tracking-[0.3em]"
            required
          />
        </div>
        {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
        <Button type="submit" variant="outline" className="h-11 w-full" disabled={pending}>
          Rejoindre mon partenaire
        </Button>
      </form>
    </div>
  );
}
