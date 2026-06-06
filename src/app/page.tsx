import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function HomeRedirect() {
  const session = await auth();
  redirect(session ? "/dashboard" : "/login");
  return null;
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeRedirect />
    </Suspense>
  );
}
