import { toast as sonnerToast } from "sonner";

export const toast = {
  success(message: string) {
    sonnerToast.success(message);
  },

  error(message: string) {
    sonnerToast.error(message);
  },

  info(message: string) {
    sonnerToast.info(message);
  },

  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) {
    return sonnerToast.promise(promise, messages);
  },
};
