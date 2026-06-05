import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function InscriptionPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center bg-background px-4 py-12">
      <div className="mb-8 space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Vesta
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Créer votre espace
        </h1>
        <p className="text-muted-foreground">
          Inscrivez-vous pour commencer votre liste à deux.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-foreground underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
