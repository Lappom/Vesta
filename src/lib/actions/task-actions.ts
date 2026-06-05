"use server";

import { put } from "@vercel/blob";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  coupleMembers,
  notifications,
  taskLocations,
  taskPhotos,
  tasks,
} from "@/db/schema";
import { requireUserCouple } from "@/lib/couple";

const taskSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
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
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  const couple = await requireUserCouple(session.user.id);
  return { session, couple };
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

  const allTasks = await db.query.tasks.findMany({
    where: eq(tasks.coupleId, couple.id),
    with: {
      category: true,
      photo: true,
      location: true,
      creator: true,
    },
    orderBy: [desc(tasks.createdAt)],
  });

  return allTasks.filter((task) => {
    if (filters?.categorySlug && task.category.slug !== filters.categorySlug) {
      return false;
    }
    if (filters?.status && task.status !== filters.status) {
      return false;
    }
    return true;
  });
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
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
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
    if (photo.size > 5 * 1024 * 1024) {
      return { error: "La photo ne doit pas dépasser 5 Mo" };
    }
    const blob = await put(`tasks/${created.id}/${photo.name}`, photo, {
      access: "public",
    });
    await db.insert(taskPhotos).values({
      taskId: created.id,
      blobUrl: blob.url,
    });
  }

  await notifyPartner(
    couple.id,
    session.user.id,
    `${session.user.name} a ajouté « ${parsed.data.title} »`,
  );

  revalidatePath("/liste");
  revalidatePath("/tableau-de-bord");
  revalidatePath("/carte");
  revalidatePath("/souvenirs");
  revalidatePath("/stats");
  return { success: true };
}

export async function updateTaskStatus(taskId: string, status: "todo" | "in_progress" | "done") {
  const { session, couple } = await getSessionCouple();

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), eq(tasks.coupleId, couple.id)),
  });

  if (!task) throw new Error("Tâche introuvable");

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
      `${session.user.name} a terminé « ${task.title} »`,
    );
  }

  revalidatePath("/liste");
  revalidatePath("/tableau-de-bord");
  revalidatePath("/souvenirs");
  revalidatePath("/stats");
}

export async function deleteTask(taskId: string) {
  const { couple } = await getSessionCouple();

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.coupleId, couple.id)));

  revalidatePath("/liste");
  revalidatePath("/tableau-de-bord");
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

export async function getMemoryPhotos() {
  const { couple } = await getSessionCouple();

  const doneTasks = await db.query.tasks.findMany({
    where: and(eq(tasks.coupleId, couple.id), eq(tasks.status, "done")),
    with: {
      category: true,
      photo: true,
    },
    orderBy: [desc(tasks.completedAt)],
  });

  return doneTasks.filter((t) => t.photo);
}

export async function getCoupleStats() {
  const { couple } = await getSessionCouple();

  const allTasks = await db.query.tasks.findMany({
    where: eq(tasks.coupleId, couple.id),
    with: { category: true },
  });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const doneThisMonth = allTasks.filter(
    (t) =>
      t.status === "done" &&
      t.completedAt &&
      t.completedAt >= monthStart,
  ).length;

  const byCategory = allTasks.reduce<Record<string, number>>((acc, task) => {
    const slug = task.category.slug;
    acc[slug] = (acc[slug] ?? 0) + 1;
    return acc;
  }, {});

  const doneCount = allTasks.filter((t) => t.status === "done").length;
  const total = allTasks.length;
  const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return {
    doneThisMonth,
    byCategory,
    completionRate,
    total,
    doneCount,
  };
}

export async function getNotifications() {
  const { session, couple } = await getSessionCouple();

  return db.query.notifications.findMany({
    where: and(
      eq(notifications.coupleId, couple.id),
      eq(notifications.userId, session.user.id),
    ),
    orderBy: [desc(notifications.createdAt)],
    limit: 20,
  });
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

  revalidatePath("/tableau-de-bord");
}
