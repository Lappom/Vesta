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
  name: z.string().min(2, "First name must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return { error: "An account already exists with this email" };
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
    redirect(`/join/${encodeURIComponent(invite)}`);
  }

  redirect("/onboarding");
}

export async function loginUser(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const invite = String(formData.get("invite") ?? "").trim();
  const redirectTo = invite
    ? `/join/${encodeURIComponent(invite)}`
    : "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Incorrect email or password" };
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}
