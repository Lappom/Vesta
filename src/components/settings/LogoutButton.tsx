"use client";

import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/actions/auth-actions";

export function LogoutButton() {
  return (
    <form action={logoutUser}>
      <Button type="submit" variant="destructive" className="w-full">
        Log out
      </Button>
    </form>
  );
}
