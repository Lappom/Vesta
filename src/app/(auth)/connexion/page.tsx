import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function ConnexionPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center bg-background px-4 py-12">
      <div className="mb-8 space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Vesta
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Bon retour à deux
        </h1>
        <p className="text-muted-foreground">
          Connectez-vous pour retrouver votre espace couple.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-foreground underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
