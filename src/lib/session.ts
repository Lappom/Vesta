import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserCouple } from "@/lib/couple";

export const getCachedSession = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
});

export const getCachedCouple = cache(async () => {
  const session = await getCachedSession();
  const couple = await getUserCouple(session.user.id);
  if (!couple) redirect("/onboarding");
  return { session, couple };
});
