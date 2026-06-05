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

export default async function JoinPage({ params }: PageProps) {
  const { token } = await params;
  const invitation = await getInvitationByToken(token);

  if (!invitation) {
    return (
      <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
        <InvalidInvitation message="This invitation link is invalid." />
      </AuthLayout>
    );
  }

  if (!invitation.isActive) {
    const message =
      invitation.status === "used"
        ? "This link has already been used."
        : invitation.status === "revoked"
          ? "This link has been revoked."
          : "This invitation link has expired.";

    return (
      <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
        <InvalidInvitation message={message} />
      </AuthLayout>
    );
  }

  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/signup?invite=${encodeURIComponent(token)}`);
  }

  const existingCouple = await getUserCouple(session.user.id);

  if (existingCouple) {
    return (
      <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
        <FeatureCard variant="lavender">
          <h1 className="text-display-sm text-ink">You already have a space</h1>
          <p className="mt-3 text-muted-foreground">
            Your account is already linked to a couple space.
          </p>
          <Link href="/dashboard" className={cn(buttonVariants(), "mt-6")}>
            Back to dashboard
          </Link>
        </FeatureCard>
      </AuthLayout>
    );
  }

  if (invitation.memberCount >= 2) {
    return (
      <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
        <InvalidInvitation message="This couple space is already full." />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
      <div className="mb-8 space-y-3">
        <p className="text-caption-uppercase text-muted-foreground">Vesta</p>
        <h1 className="text-display-sm text-ink">Join a couple space</h1>
        <p className="text-muted-foreground">
          You&apos;ve been invited to join a couple space on Vesta.
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
      <h1 className="text-display-sm text-ink">Link unavailable</h1>
      <p className="mt-3 text-muted-foreground">{message}</p>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
      >
        Sign in
      </Link>
    </FeatureCard>
  );
}
