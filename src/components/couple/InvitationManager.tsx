"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createInvitationLink,
  revokeInvitation,
} from "@/lib/actions/invitation-actions";

type InvitationItem = {
  id: string;
  token: string;
  url: string;
  expiresAt: string;
  revokedAt: string | null;
  usedAt: string | null;
  createdAt: string;
  status: "active" | "revoked" | "used" | "expired";
};

type InvitationManagerProps = {
  invitations: InvitationItem[];
  isCoupleFull: boolean;
};

const statusLabels: Record<InvitationItem["status"], string> = {
  active: "Active",
  revoked: "Revoked",
  used: "Used",
  expired: "Expired",
};

export function InvitationManager({
  invitations: initialInvitations,
  isCoupleFull,
}: InvitationManagerProps) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const activeInvitations = invitations.filter(
    (invitation) => invitation.status === "active",
  );
  const pastInvitations = invitations.filter(
    (invitation) => invitation.status !== "active",
  );

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Unable to copy link");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Create a secure link valid for 7 days. Regenerating the 6-digit code
        does not affect these links.
      </p>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="button"
        disabled={pending || isCoupleFull}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await createInvitationLink();
            if (result?.error) {
              setError(result.error);
              return;
            }

            if (result?.invitation) {
              setInvitations((current) => [
                {
                  id: result.invitation.id,
                  token: result.invitation.token,
                  url: result.invitation.url,
                  expiresAt: result.invitation.expiresAt,
                  revokedAt: null,
                  usedAt: null,
                  createdAt: new Date().toISOString(),
                  status: "active",
                },
                ...current,
              ]);
              toast.success("Invitation link created");
            }
          });
        }}
      >
        {pending ? "Creating…" : "Create invitation link"}
      </Button>

      {isCoupleFull ? (
        <p className="text-sm text-muted-foreground">
          Your space is full. No new links can be created.
        </p>
      ) : null}

      {activeInvitations.length > 0 ? (
        <ul className="space-y-3">
          {activeInvitations.map((invitation) => (
            <li
              key={invitation.id}
              className="rounded-xl border border-hairline bg-background p-4"
            >
              <p className="truncate text-sm font-medium">{invitation.url}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Expires{" "}
                {format(new Date(invitation.expiresAt), "MMMM d, yyyy", {
                  locale: enUS,
                })}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() => handleCopy(invitation.url)}
                >
                  Copy link
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => {
                    setError(null);
                    startTransition(async () => {
                      const result = await revokeInvitation(invitation.id);
                      if (result?.error) {
                        setError(result.error);
                        return;
                      }

                      setInvitations((current) =>
                        current.map((item) =>
                          item.id === invitation.id
                            ? {
                                ...item,
                                status: "revoked",
                                revokedAt: new Date().toISOString(),
                              }
                            : item,
                        ),
                      );
                      toast.success("Link revoked");
                    });
                  }}
                >
                  Revoke
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No active links at the moment.
        </p>
      )}

      {pastInvitations.length > 0 ? (
        <div className="space-y-2 border-t border-hairline pt-4">
          <p className="text-caption-uppercase text-muted-foreground">
            Past links
          </p>
          <ul className="space-y-2">
            {pastInvitations.map((invitation) => (
              <li
                key={invitation.id}
                className="flex items-center justify-between gap-3 text-sm text-muted-foreground"
              >
                <span className="truncate">
                  {format(new Date(invitation.createdAt), "MMM d, yyyy", {
                    locale: enUS,
                  })}
                </span>
                <span>{statusLabels[invitation.status]}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
