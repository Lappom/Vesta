"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { coupleInvitations, coupleMembers } from "@/db/schema";
import { getUserCouple } from "@/lib/couple";
import {
  buildInviteUrl,
  generateInviteToken,
  getInvitationStatus,
  INVITE_TOKEN_TTL_MS,
  isInvitationActive,
} from "@/lib/invite";

async function requireCoupleMembership(userId: string) {
  const couple = await getUserCouple(userId);
  if (!couple) {
    throw new Error("No couple space found");
  }

  const membership = couple.members.find((member) => member.userId === userId);
  if (!membership) {
    throw new Error("Access denied");
  }

  return { couple, membership };
}

export async function createInvitationLink() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { couple } = await requireCoupleMembership(session.user.id);

  if (couple.members.length >= 2) {
    return { error: "Your couple space is already full" };
  }

  const token = generateInviteToken();
  const expiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_MS);

  const [invitation] = await db
    .insert(coupleInvitations)
    .values({
      coupleId: couple.id,
      token,
      createdBy: session.user.id,
      expiresAt,
    })
    .returning();

  revalidatePath("/settings");

  return {
    invitation: {
      id: invitation.id,
      token: invitation.token,
      expiresAt: invitation.expiresAt.toISOString(),
      url: buildInviteUrl(invitation.token),
    },
  };
}

export async function revokeInvitation(invitationId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { couple, membership } = await requireCoupleMembership(session.user.id);

  const invitation = await db.query.coupleInvitations.findFirst({
    where: eq(coupleInvitations.id, invitationId),
  });

  if (!invitation || invitation.coupleId !== couple.id) {
    return { error: "Invitation not found" };
  }

  if (
    invitation.createdBy !== session.user.id &&
    membership.role !== "owner"
  ) {
    return { error: "You cannot revoke this link" };
  }

  if (invitation.revokedAt || invitation.usedAt) {
    return { error: "This link is no longer active" };
  }

  await db
    .update(coupleInvitations)
    .set({ revokedAt: new Date() })
    .where(eq(coupleInvitations.id, invitationId));

  revalidatePath("/settings");
}

export async function getCoupleInvitations() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { couple } = await requireCoupleMembership(session.user.id);

  const invitations = await db.query.coupleInvitations.findMany({
    where: eq(coupleInvitations.coupleId, couple.id),
    orderBy: [desc(coupleInvitations.createdAt)],
  });

  return invitations.map((invitation) => ({
    id: invitation.id,
    token: invitation.token,
    url: buildInviteUrl(invitation.token),
    expiresAt: invitation.expiresAt.toISOString(),
    revokedAt: invitation.revokedAt?.toISOString() ?? null,
    usedAt: invitation.usedAt?.toISOString() ?? null,
    createdAt: invitation.createdAt.toISOString(),
    status: getInvitationStatus(invitation),
  }));
}

export async function acceptInvitation(token: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const existing = await getUserCouple(session.user.id);
  if (existing) redirect("/dashboard");

  const invitation = await db.query.coupleInvitations.findFirst({
    where: eq(coupleInvitations.token, token),
    with: {
      couple: {
        with: {
          members: true,
        },
      },
    },
  });

  if (!invitation || !isInvitationActive(invitation)) {
    return { error: "Link expired, revoked, or already used" };
  }

  if (invitation.couple.members.length >= 2) {
    return { error: "This couple space is already full" };
  }

  await db.insert(coupleMembers).values({
    coupleId: invitation.coupleId,
    userId: session.user.id,
    role: "member",
  });

  await db
    .update(coupleInvitations)
    .set({
      usedAt: new Date(),
      usedBy: session.user.id,
    })
    .where(eq(coupleInvitations.id, invitation.id));

  revalidatePath("/");
  redirect("/dashboard");
}

export async function getInvitationByToken(token: string) {
  const invitation = await db.query.coupleInvitations.findFirst({
    where: eq(coupleInvitations.token, token),
    with: {
      couple: {
        with: {
          members: true,
        },
      },
    },
  });

  if (!invitation) {
    return null;
  }

  return {
    ...invitation,
    status: getInvitationStatus(invitation),
    isActive: isInvitationActive(invitation),
    memberCount: invitation.couple.members.length,
  };
}
