import Link from "next/link";
import { AuthWelcomeHero } from "@/components/illustrations/AuthWelcomeHero";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

type PageProps = {
  searchParams: Promise<{ invite?: string }>;
};

export default async function SignupPage({ searchParams }: PageProps) {
  const { invite } = await searchParams;
  const loginHref = invite
    ? `/login?invite=${encodeURIComponent(invite)}`
    : "/login";

  return (
    <AuthLayout illustration={<AuthWelcomeHero className="w-full" />}>
      <div className="mb-8 space-y-2">
        <p className="text-caption-uppercase text-muted-foreground">Vesta</p>
        <h1 className="text-display-sm text-ink">
          {invite ? "Join a couple space" : "Create your space"}
        </h1>
        <p className="text-muted-foreground">
          {invite
            ? "Create your account to accept the invitation."
            : "Sign up to start your list for two."}
        </p>
      </div>

      <RegisterForm invite={invite} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-ink underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
