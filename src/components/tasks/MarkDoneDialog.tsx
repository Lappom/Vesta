"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

type MarkDoneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
  pending?: boolean;
  serverError?: string | null;
  onComplete: (formData: FormData | null) => void;
};

export function MarkDoneDialog({
  open,
  onOpenChange,
  taskId,
  taskTitle,
  pending = false,
  serverError = null,
  onComplete,
}: MarkDoneDialogProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetSelection();
    }
    onOpenChange(nextOpen);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > MAX_PHOTO_BYTES) {
      setError("Photo must not exceed 5 MB");
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submitWithPhoto = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.set("taskId", taskId);
    formData.set("photo", selectedFile);
    onComplete(formData);
  };

  const submitWithoutPhoto = () => {
    onComplete(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-display-sm">
            Mark as done
          </DialogTitle>
          <DialogDescription>
            {previewUrl
              ? `Save this memory for “${taskTitle}”?`
              : `Add a memory photo for “${taskTitle}”? It will appear in your memories album.`}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={galleryInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          capture="environment"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-lg ring-1 ring-hairline">
            <Image
              src={previewUrl}
              alt="Memory preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
              unoptimized
            />
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-auto min-h-11 flex-col gap-2 py-4"
              disabled={pending}
              onClick={() => galleryInputRef.current?.click()}
            >
              <ImageIcon className="size-5" />
              Choose from gallery
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-auto min-h-11 flex-col gap-2 py-4"
              disabled={pending}
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="size-5" />
              Take a new photo
            </Button>
          </div>
        )}

        {error || serverError ? (
          <p className="text-sm text-destructive">{error ?? serverError}</p>
        ) : null}

        <DialogFooter className="border-t-0 bg-transparent p-0 sm:flex-row sm:justify-stretch">
          {previewUrl ? (
            <>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={resetSelection}
              >
                Choose another
              </Button>
              <Button
                type="button"
                className="sm:ml-auto"
                disabled={pending}
                onClick={submitWithPhoto}
              >
                {pending ? "Saving…" : "Save memory & mark done"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="sm:ml-auto"
                disabled={pending}
                onClick={submitWithoutPhoto}
              >
                {pending ? "Saving…" : "Mark done without photo"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
