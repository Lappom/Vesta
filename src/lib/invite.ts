import { randomBytes } from "crypto";
import type { coupleInvitations } from "@/db/schema";

export const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function generateInviteToken() {
  return randomBytes(24).toString("base64url");
}

export function buildInviteUrl(token: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${baseUrl}/join/${token}`;
}

type InvitationRecord = Pick<
  typeof coupleInvitations.$inferSelect,
  "expiresAt" | "revokedAt" | "usedAt"
>;

export function isInvitationActive(invitation: InvitationRecord) {
  if (invitation.revokedAt || invitation.usedAt) {
    return false;
  }

  return invitation.expiresAt.getTime() > Date.now();
}

export function getInvitationStatus(
  invitation: InvitationRecord,
): "active" | "revoked" | "used" | "expired" {
  if (invitation.revokedAt) return "revoked";
  if (invitation.usedAt) return "used";
  if (invitation.expiresAt.getTime() <= Date.now()) return "expired";
  return "active";
}
