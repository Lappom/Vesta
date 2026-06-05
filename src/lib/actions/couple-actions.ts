"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { coupleMembers, couples } from "@/db/schema";
import { generateInviteCode, getUserCouple } from "@/lib/couple";

export async function createCouple() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const existing = await getUserCouple(session.user.id);
  if (existing) redirect("/tableau-de-bord");

  let inviteCode = generateInviteCode();
  let attempts = 0;

  while (attempts < 5) {
    const conflict = await db.query.couples.findFirst({
      where: eq(couples.inviteCode, inviteCode),
    });
    if (!conflict) break;
    inviteCode = generateInviteCode();
    attempts++;
  }

  const [created] = await db
    .insert(couples)
    .values({ inviteCode })
    .returning();

  await db.insert(coupleMembers).values({
    coupleId: created.id,
    userId: session.user.id,
    role: "owner",
  });

  revalidatePath("/");
  redirect("/tableau-de-bord");
}

export async function joinCouple(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const existing = await getUserCouple(session.user.id);
  if (existing) redirect("/tableau-de-bord");

  const code = String(formData.get("inviteCode") ?? "").trim();

  if (!/^\d{6}$/.test(code)) {
    return { error: "Le code doit contenir 6 chiffres" };
  }

  const couple = await db.query.couples.findFirst({
    where: eq(couples.inviteCode, code),
  });

  if (!couple) {
    return { error: "Code d'invitation invalide" };
  }

  const [memberCount] = await db
    .select({ value: count() })
    .from(coupleMembers)
    .where(eq(coupleMembers.coupleId, couple.id));

  if ((memberCount?.value ?? 0) >= 2) {
    return { error: "Cet espace couple est déjà complet" };
  }

  await db.insert(coupleMembers).values({
    coupleId: couple.id,
    userId: session.user.id,
    role: "member",
  });

  revalidatePath("/");
  redirect("/tableau-de-bord");
}

export async function regenerateInviteCode() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const membership = await db.query.coupleMembers.findFirst({
    where: eq(coupleMembers.userId, session.user.id),
  });

  if (!membership || membership.role !== "owner") {
    throw new Error("Seul le créateur peut régénérer le code");
  }

  const inviteCode = generateInviteCode();
  await db
    .update(couples)
    .set({ inviteCode })
    .where(eq(couples.id, membership.coupleId));

  revalidatePath("/parametres");
}
