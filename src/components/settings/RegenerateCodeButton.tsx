"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { regenerateInviteCode } from "@/lib/actions/couple-actions";
import { toast } from "@/lib/toast";

export function RegenerateCodeButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await regenerateInviteCode();
        setOpen(false);
        router.refresh();
        toast.success("Invite code regenerated");
      } catch {
        toast.error("Unable to regenerate code");
      }
    });
  };

  return (
    <>
      <Button type="button" variant="accent" onClick={() => setOpen(true)}>
        Regenerate code
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate invite code?</DialogTitle>
            <DialogDescription>
              The current 6-digit code will stop working immediately. Your
              partner will need the new code to join.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={handleConfirm}
            >
              {pending ? "Regenerating…" : "Regenerate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
