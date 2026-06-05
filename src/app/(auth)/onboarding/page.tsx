import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { OnboardingForm } from "@/components/couple/OnboardingForm";
import { getUserCouple } from "@/lib/couple";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const couple = await getUserCouple(session.user.id);
  if (couple) redirect("/tableau-de-bord");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center bg-background px-4 py-12">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Liez votre espace couple
        </h1>
        <p className="text-muted-foreground">
          Créez un code à 6 chiffres ou rejoignez celui de votre partenaire.
        </p>
      </div>
      <div className="rounded-3xl bg-muted p-6">
        <OnboardingForm />
      </div>
    </div>
  );
}
