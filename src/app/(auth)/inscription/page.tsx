import Link from "next/link";
import { AuthWelcomeHero } from "@/components/illustrations/AuthWelcomeHero";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function InscriptionPage() {
  return (
    <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
      <div className="mb-8 space-y-2">
        <p className="text-caption-uppercase text-muted-foreground">Vesta</p>
        <h1 className="text-display-sm text-ink">Créer votre espace</h1>
        <p className="text-muted-foreground">
          Inscrivez-vous pour commencer votre liste à deux.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="font-semibold text-ink underline underline-offset-4"
        >
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
