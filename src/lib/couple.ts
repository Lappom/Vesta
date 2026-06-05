import { eq } from "drizzle-orm";
import { db } from "@/db";
import { coupleMembers } from "@/db/schema";

export function generateInviteCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getUserCouple(userId: string) {
  const membership = await db.query.coupleMembers.findFirst({
    where: eq(coupleMembers.userId, userId),
    with: {
      couple: {
        with: {
          members: true,
        },
      },
    },
  });

  if (!membership) return null;

  return membership.couple;
}

export async function requireUserCouple(userId: string) {
  const couple = await getUserCouple(userId);
  if (!couple) {
    throw new Error("No couple space found");
  }
  return couple;
}
