import { auth } from "@/auth";
import { logoutUser } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { PageHeader } from "@/components/ui/page-header";
import { getUserCouple } from "@/lib/couple";
import { regenerateInviteCode } from "@/lib/actions/couple-actions";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const session = await auth();
  const couple = await getUserCouple(session!.user!.id);

  const membership = couple!.members.find((m) => m.userId === session!.user!.id);
  const isOwner = membership?.role === "owner";

  return (
    <div className="stagger-children space-y-6">
      <PageHeader
        caption="Réglages"
        title="Paramètres"
        description="Gérez votre compte et votre espace couple."
      />

      <FeatureCard variant="cream">
        <h2 className="text-lg font-semibold">Compte</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {session!.user!.email}
        </p>
        <p className="text-sm font-medium">{session!.user!.name}</p>
      </FeatureCard>

      <FeatureCard variant="cream" className="bg-surface-soft">
        <h2 className="text-lg font-semibold">Code d&apos;invitation</h2>
        <p className="mt-3 font-display text-display-lg tracking-[0.2em]">
          {couple!.inviteCode}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Partagez ce code à 6 chiffres avec votre partenaire.
        </p>
        {isOwner ? (
          <form action={regenerateInviteCode} className="mt-4">
            <Button type="submit" variant="outline">
              Régénérer le code
            </Button>
          </form>
        ) : null}
      </FeatureCard>

      <FeatureCard variant="cream">
        <h2 className="text-lg font-semibold">Espace couple</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {couple!.members.length}/2 membres ·{" "}
          {couple!.members.length < 2
            ? "En attente de votre partenaire"
            : "Couple complet"}
        </p>
      </FeatureCard>

      <form action={logoutUser}>
        <Button type="submit" variant="destructive" className="w-full">
          Se déconnecter
        </Button>
      </form>
    </div>
  );
}
