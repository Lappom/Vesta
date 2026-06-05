import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { VestaBrand } from "@/components/brand/VestaBrand";
import { OnboardingHero } from "@/components/illustrations/OnboardingHero";
import { OnboardingForm } from "@/components/couple/OnboardingForm";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { getUserCouple } from "@/lib/couple";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const couple = await getUserCouple(session.user.id);
  if (couple) redirect("/tableau-de-bord");

  return (
    <AuthLayout illustration={<OnboardingHero className="w-full" />}>
      <div className="mb-8 space-y-3">
        <VestaBrand size="sm" />
        <h1 className="text-display-sm text-ink">Liez votre espace couple</h1>
        <p className="text-muted-foreground">
          Créez un code à 6 chiffres ou rejoignez celui de votre partenaire.
        </p>
      </div>
      <OnboardingForm />
    </AuthLayout>
  );
}
