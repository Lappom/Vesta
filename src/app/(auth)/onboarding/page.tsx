import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { VestaBrand } from "@/components/brand/VestaBrand";
import { OnboardingHero } from "@/components/illustrations/OnboardingHero";
import { OnboardingForm } from "@/components/couple/OnboardingForm";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { getUserCouple } from "@/lib/couple";


export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const couple = await getUserCouple(session.user.id);
  if (couple) redirect("/dashboard");

  return (
    <AuthLayout illustration={<OnboardingHero className="w-full" />}>
      <div className="mb-8 space-y-3">
        <VestaBrand size="sm" />
        <h1 className="text-display-sm text-ink">Link your couple space</h1>
        <p className="text-muted-foreground">
          Create a 6-digit code or join your partner&apos;s.
        </p>
      </div>
      <OnboardingForm />
    </AuthLayout>
  );
}
