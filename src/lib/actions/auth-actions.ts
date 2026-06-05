"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

const registerSchema = z.object({
  name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return { error: "Un compte existe déjà avec cet email" };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await db.insert(users).values({
    name: parsed.data.name,
    email,
    passwordHash,
  });

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirect: false,
  });

  const invite = String(formData.get("invite") ?? "").trim();
  if (invite) {
    redirect(`/rejoindre/${encodeURIComponent(invite)}`);
  }

  redirect("/onboarding");
}

export async function loginUser(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const invite = String(formData.get("invite") ?? "").trim();
  const redirectTo = invite
    ? `/rejoindre/${encodeURIComponent(invite)}`
    : "/tableau-de-bord";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect" };
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/connexion" });
}
