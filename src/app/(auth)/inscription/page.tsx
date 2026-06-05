import Link from "next/link";
import { AuthWelcomeHero } from "@/components/illustrations/AuthWelcomeHero";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

type PageProps = {
  searchParams: Promise<{ invite?: string }>;
};

export default async function InscriptionPage({ searchParams }: PageProps) {
  const { invite } = await searchParams;
  const connexionHref = invite
    ? `/connexion?invite=${encodeURIComponent(invite)}`
    : "/connexion";

  return (
    <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
      <div className="mb-8 space-y-2">
        <p className="text-caption-uppercase text-muted-foreground">Vesta</p>
        <h1 className="text-display-sm text-ink">
          {invite ? "Rejoindre un espace couple" : "Créer votre espace"}
        </h1>
        <p className="text-muted-foreground">
          {invite
            ? "Créez votre compte pour accepter l'invitation."
            : "Inscrivez-vous pour commencer votre liste à deux."}
        </p>
      </div>

      <RegisterForm invite={invite} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link
          href={connexionHref}
          className="font-semibold text-ink underline underline-offset-4"
        >
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
