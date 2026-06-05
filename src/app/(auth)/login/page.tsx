import Link from "next/link";
import { AuthConnectHero } from "@/components/illustrations/AuthConnectHero";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

type PageProps = {
  searchParams: Promise<{ invite?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { invite } = await searchParams;
  const signupHref = invite
    ? `/signup?invite=${encodeURIComponent(invite)}`
    : "/signup";

  return (
    <AuthLayout illustration={<AuthConnectHero className="w-full" />}>
      <div className="mb-8 space-y-2">
        <p className="text-caption-uppercase text-muted-foreground">Vesta</p>
        <h1 className="text-display-sm text-ink">
          {invite ? "Sign in to join" : "Welcome back"}
        </h1>
        <p className="text-muted-foreground">
          {invite
            ? "Sign in to accept the couple space invitation."
            : "Sign in to return to your couple space."}
        </p>
      </div>

      <LoginForm invite={invite} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={signupHref}
          className="font-semibold text-ink underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
