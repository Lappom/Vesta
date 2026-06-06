"use server";

import { put } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  coupleMembers,
  notifications,
  taskLocations,
  taskPhotos,
  tasks,
} from "@/db/schema";
import {
  queryCoupleNotifications,
  queryCoupleStats,
  queryCoupleTasks,
} from "@/lib/queries/tasks";
import { getCachedCouple } from "@/lib/session";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  assignee: z.enum(["me", "partner", "both"]).optional(),
  dueAt: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  locationLabel: z.string().optional(),
});

async function getSessionCouple() {
  return getCachedCouple();
}

async function saveTaskPhoto(taskId: string, photo: File) {
  if (photo.size > 5 * 1024 * 1024) {
    return { error: "Photo must not exceed 5 MB" } as const;
  }

  const blob = await put(`tasks/${taskId}/${photo.name}`, photo, {
    access: "private",
    allowOverwrite: true,
  });

  const existingPhoto = await db.query.taskPhotos.findFirst({
    where: eq(taskPhotos.taskId, taskId),
  });

  if (existingPhoto) {
    await db
      .update(taskPhotos)
      .set({ blobUrl: blob.url })
      .where(eq(taskPhotos.taskId, taskId));
  } else {
    await db.insert(taskPhotos).values({
      taskId,
      blobUrl: blob.url,
    });
  }

  return { success: true } as const;
}

function revalidateMemories(coupleId: string) {
  revalidateTag(`memories-${coupleId}`, "max");
  revalidatePath("/memories");
}

async function notifyPartner(
  coupleId: string,
  actorId: string,
  message: string,
) {
  const members = await db.query.coupleMembers.findMany({
    where: eq(coupleMembers.coupleId, coupleId),
  });

  const partner = members.find((member) => member.userId !== actorId);
  if (!partner) return;

  await db.insert(notifications).values({
    coupleId,
    userId: partner.userId,
    message,
  });
}

export async function getTasks(filters?: {
  categorySlug?: string;
  status?: string;
}) {
  const { couple } = await getSessionCouple();
  return queryCoupleTasks(couple.id, filters);
}

export async function createTask(formData: FormData) {
  const { session, couple } = await getSessionCouple();

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    categoryId: formData.get("categoryId"),
    assignee: formData.get("assignee") || "both",
    dueAt: formData.get("dueAt") || undefined,
    lat: formData.get("lat") || undefined,
    lng: formData.get("lng") || undefined,
    locationLabel: formData.get("locationLabel") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const [created] = await db
    .insert(tasks)
    .values({
      coupleId: couple.id,
      createdBy: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      assignee: parsed.data.assignee ?? "both",
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : undefined,
    })
    .returning();

  if (parsed.data.lat && parsed.data.lng) {
    await db.insert(taskLocations).values({
      taskId: created.id,
      lat: parseFloat(parsed.data.lat),
      lng: parseFloat(parsed.data.lng),
      label: parsed.data.locationLabel,
    });
  }

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const photoResult = await saveTaskPhoto(created.id, photo);
    if ("error" in photoResult) {
      return photoResult;
    }
  }

  await notifyPartner(
    couple.id,
    session.user.id,
    `${session.user.name} added "${parsed.data.title}"`,
  );

  revalidatePath("/list");
  revalidatePath("/dashboard");
  revalidatePath("/map");
  revalidateMemories(couple.id);
  revalidatePath("/stats");
  return { success: true };
}

export async function updateTask(formData: FormData) {
  const { session, couple } = await getSessionCouple();

  const taskId = formData.get("taskId");
  if (typeof taskId !== "string" || !taskId) {
    return { error: "Task ID is required" };
  }

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    categoryId: formData.get("categoryId"),
    assignee: formData.get("assignee") || "both",
    dueAt: formData.get("dueAt") || undefined,
    lat: formData.get("lat") || undefined,
    lng: formData.get("lng") || undefined,
    locationLabel: formData.get("locationLabel") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), eq(tasks.coupleId, couple.id)),
  });

  if (!task) {
    return { error: "Task not found" };
  }

  await db
    .update(tasks)
    .set({
      title: parsed.data.title,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      assignee: parsed.data.assignee ?? "both",
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  const existingLocation = await db.query.taskLocations.findFirst({
    where: eq(taskLocations.taskId, taskId),
  });

  if (parsed.data.lat && parsed.data.lng) {
    const locationValues = {
      lat: parseFloat(parsed.data.lat),
      lng: parseFloat(parsed.data.lng),
      label: parsed.data.locationLabel,
    };

    if (existingLocation) {
      await db
        .update(taskLocations)
        .set(locationValues)
        .where(eq(taskLocations.taskId, taskId));
    } else {
      await db.insert(taskLocations).values({
        taskId,
        ...locationValues,
      });
    }
  } else if (existingLocation) {
    await db.delete(taskLocations).where(eq(taskLocations.taskId, taskId));
  }

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const photoResult = await saveTaskPhoto(taskId, photo);
    if ("error" in photoResult) {
      return photoResult;
    }
  }

  await notifyPartner(
    couple.id,
    session.user.id,
    `${session.user.name} updated "${parsed.data.title}"`,
  );

  revalidatePath("/list");
  revalidatePath("/dashboard");
  revalidatePath("/map");
  revalidateMemories(couple.id);
  revalidatePath("/stats");
  return { success: true };
}

export async function completeTask(formData: FormData) {
  const { session, couple } = await getSessionCouple();

  const taskId = formData.get("taskId");
  if (typeof taskId !== "string" || !taskId) {
    return { error: "Task ID is required" };
  }

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), eq(tasks.coupleId, couple.id)),
  });

  if (!task) {
    return { error: "Task not found" };
  }

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const photoResult = await saveTaskPhoto(taskId, photo);
    if ("error" in photoResult) {
      return photoResult;
    }
  }

  await db
    .update(tasks)
    .set({
      status: "done",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  await notifyPartner(
    couple.id,
    session.user.id,
    `${session.user.name} completed "${task.title}"`,
  );

  revalidatePath("/list");
  revalidatePath("/dashboard");
  revalidatePath("/map");
  revalidateMemories(couple.id);
  revalidatePath("/stats");
  return { success: true };
}

export async function updateTaskStatus(taskId: string, status: "todo" | "in_progress" | "done") {
  const { session, couple } = await getSessionCouple();

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), eq(tasks.coupleId, couple.id)),
  });

  if (!task) throw new Error("Task not found");

  await db
    .update(tasks)
    .set({
      status,
      completedAt: status === "done" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  if (status === "done") {
    await notifyPartner(
      couple.id,
      session.user.id,
      `${session.user.name} completed "${task.title}"`,
    );
  }

  revalidatePath("/list");
  revalidatePath("/dashboard");
  revalidateMemories(couple.id);
  revalidatePath("/stats");
}

export async function deleteTask(taskId: string) {
  const { couple } = await getSessionCouple();

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.coupleId, couple.id)));

  revalidatePath("/list");
  revalidatePath("/dashboard");
}

export async function getCategories() {
  return db.query.categories.findMany();
}

export async function getTasksWithLocation() {
  const { couple } = await getSessionCouple();

  return db.query.tasks.findMany({
    where: eq(tasks.coupleId, couple.id),
    with: {
      category: true,
      location: true,
    },
  });
}

export async function getCoupleStats() {
  const { couple } = await getSessionCouple();
  return queryCoupleStats(couple.id);
}

export async function getNotifications() {
  const { session, couple } = await getSessionCouple();
  return queryCoupleNotifications(couple.id, session.user.id);
}

export async function markNotificationsRead() {
  const { session, couple } = await getSessionCouple();

  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(
        eq(notifications.coupleId, couple.id),
        eq(notifications.userId, session.user.id),
      ),
    );

  revalidatePath("/dashboard");
}
