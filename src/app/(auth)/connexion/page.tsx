import Link from "next/link";
import { AuthConnectHero } from "@/components/illustrations/AuthConnectHero";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ConnexionPage() {
  return (
    <AuthLayout illustration={<AuthConnectHero className="w-full" />}>
      <div className="mb-8 space-y-2">
        <p className="text-caption-uppercase text-muted-foreground">Vesta</p>
        <h1 className="text-display-sm text-ink">Bon retour à deux</h1>
        <p className="text-muted-foreground">
          Connectez-vous pour retrouver votre espace couple.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-semibold text-ink underline underline-offset-4"
        >
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  );
}
