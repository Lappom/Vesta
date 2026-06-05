"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";

type JoinInvitationFormProps = {
  token: string;
  acceptInvitation: (
    token: string,
  ) => Promise<{ error?: string } | void>;
};

export function JoinInvitationForm({
  token,
  acceptInvitation,
}: JoinInvitationFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <FeatureCard variant="peach">
      <p className="text-sm text-muted-foreground">
        By confirming, you will join your partner&apos;s couple space.
      </p>
      <form
        action={() => {
          setError(null);
          startTransition(async () => {
            const result = await acceptInvitation(token);
            if (result?.error) setError(result.error);
          });
        }}
        className="mt-6"
      >
        {error ? (
          <p className="mb-4 text-center text-sm text-destructive">{error}</p>
        ) : null}
        <Button
          type="submit"
          variant="on-color"
          className="w-full"
          disabled={pending}
        >
          {pending ? "Joining space…" : "Join space"}
        </Button>
      </form>
    </FeatureCard>
  );
}
