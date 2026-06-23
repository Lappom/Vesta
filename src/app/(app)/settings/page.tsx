import { auth } from "@/auth";
import { InvitationManager } from "@/components/couple/InvitationManager";
import { LogoutButton } from "@/components/settings/LogoutButton";
import { RegenerateCodeButton } from "@/components/settings/RegenerateCodeButton";
import { FeatureCard } from "@/components/ui/feature-card";
import { PageHeader } from "@/components/ui/page-header";
import { getUserCouple } from "@/lib/couple";
import { getCoupleInvitations } from "@/lib/actions/invitation-actions";


export default async function SettingsPage() {
  const session = await auth();
  const couple = await getUserCouple(session!.user!.id);
  const invitations = await getCoupleInvitations();

  const membership = couple!.members.find((m) => m.userId === session!.user!.id);
  const isOwner = membership?.role === "owner";
  const isCoupleFull = couple!.members.length >= 2;

  return (
    <div className="stagger-children space-y-6">
      <PageHeader
        caption="Settings"
        title="Settings"
        description="Manage your account and couple space."
      />

      <FeatureCard variant="cream">
        <h2 className="font-display text-display-sm text-ink">Account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {session!.user!.email}
        </p>
        <p className="text-sm font-medium">{session!.user!.name}</p>
      </FeatureCard>

      <FeatureCard variant="cream" className="bg-surface-soft">
        <h2 className="font-display text-display-sm text-ink">Invite code</h2>
        <p className="mt-3 font-display text-display-lg tracking-[0.2em]">
          {couple!.inviteCode}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Share this 6-digit code with your partner.
        </p>
        {isOwner ? (
          <div className="mt-4">
            <RegenerateCodeButton />
          </div>
        ) : null}
      </FeatureCard>

      <FeatureCard variant="cream">
        <h2 className="font-display text-display-sm text-ink">Invitation links</h2>
        <div className="mt-4">
          <InvitationManager
            invitations={invitations}
            isCoupleFull={isCoupleFull}
          />
        </div>
      </FeatureCard>

      <FeatureCard variant="cream">
        <h2 className="font-display text-display-sm text-ink">Couple space</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {couple!.members.length}/2 members ·{" "}
          {couple!.members.length < 2
            ? "Waiting for your partner"
            : "Couple complete"}
        </p>
      </FeatureCard>

      <LogoutButton />
    </div>
  );
}
