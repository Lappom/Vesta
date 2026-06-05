import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthWelcomeHero } from "@/components/illustrations/AuthWelcomeHero";
import { JoinInvitationForm } from "@/components/couple/JoinInvitationForm";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { buttonVariants } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import {
  acceptInvitation,
  getInvitationByToken,
} from "@/lib/actions/invitation-actions";
import { getUserCouple } from "@/lib/couple";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function RejoindrePage({ params }: PageProps) {
  const { token } = await params;
  const invitation = await getInvitationByToken(token);

  if (!invitation) {
    return (
      <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
        <InvalidInvitation message="Ce lien d'invitation est invalide." />
      </AuthLayout>
    );
  }

  if (!invitation.isActive) {
    const message =
      invitation.status === "used"
        ? "Ce lien a déjà été utilisé."
        : invitation.status === "revoked"
          ? "Ce lien a été révoqué."
          : "Ce lien d'invitation a expiré.";

    return (
      <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
        <InvalidInvitation message={message} />
      </AuthLayout>
    );
  }

  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/inscription?invite=${encodeURIComponent(token)}`);
  }

  const existingCouple = await getUserCouple(session.user.id);

  if (existingCouple) {
    return (
      <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
        <FeatureCard variant="lavender">
          <h1 className="text-display-sm text-ink">Vous avez déjà un espace</h1>
          <p className="mt-3 text-muted-foreground">
            Votre compte est déjà rattaché à un espace couple.
          </p>
          <Link href="/tableau-de-bord" className={cn(buttonVariants(), "mt-6")}>
            Retour au tableau de bord
          </Link>
        </FeatureCard>
      </AuthLayout>
    );
  }

  if (invitation.memberCount >= 2) {
    return (
      <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
        <InvalidInvitation message="Cet espace couple est déjà complet." />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
      <div className="mb-8 space-y-3">
        <p className="text-caption-uppercase text-muted-foreground">Vesta</p>
        <h1 className="text-display-sm text-ink">Rejoindre un espace couple</h1>
        <p className="text-muted-foreground">
          Vous avez été invité·e à rejoindre un espace à deux sur Vesta.
        </p>
      </div>
      <JoinInvitationForm
        token={token}
        acceptInvitation={acceptInvitation}
      />
    </AuthLayout>
  );
}

function InvalidInvitation({ message }: { message: string }) {
  return (
    <FeatureCard variant="lavender">
      <h1 className="text-display-sm text-ink">Lien indisponible</h1>
      <p className="mt-3 text-muted-foreground">{message}</p>
      <Link
        href="/connexion"
        className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
      >
        Se connecter
      </Link>
    </FeatureCard>
  );
}
