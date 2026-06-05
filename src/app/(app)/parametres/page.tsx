import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutUser } from "@/lib/actions/auth-actions";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { getUserCouple } from "@/lib/couple";
import { regenerateInviteCode } from "@/lib/actions/couple-actions";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const couple = await getUserCouple(session.user.id);
  if (!couple) redirect("/onboarding");

  const membership = couple.members.find((m) => m.userId === session.user.id);
  const isOwner = membership?.role === "owner";

  return (
    <AppShell title="Réglages">
      <div className="space-y-4">
        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Compte</h2>
          <p className="mt-2 text-sm text-muted-foreground">{session.user.email}</p>
          <p className="text-sm">{session.user.name}</p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Code d&apos;invitation</h2>
          <p className="mt-2 text-4xl font-semibold tracking-[0.25em]">
            {couple.inviteCode}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Partagez ce code à 6 chiffres avec votre partenaire.
          </p>
          {isOwner ? (
            <form action={regenerateInviteCode} className="mt-4">
              <Button type="submit" variant="outline" className="h-11">
                Régénérer le code
              </Button>
            </form>
          ) : null}
        </section>

        <section className="rounded-3xl bg-muted p-5">
          <h2 className="text-lg font-semibold">Espace couple</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {couple.members.length}/2 membres ·{" "}
            {couple.members.length < 2
              ? "En attente de votre partenaire"
              : "Couple complet"}
          </p>
        </section>

        <form action={logoutUser}>
          <Button type="submit" variant="destructive" className="h-11 w-full">
            Se déconnecter
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
