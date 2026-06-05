import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications, tasks } from "@/db/schema";

export async function queryCoupleTasks(
  coupleId: string,
  filters?: { categorySlug?: string; status?: string },
) {
  const allTasks = await db.query.tasks.findMany({
    where: eq(tasks.coupleId, coupleId),
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

export async function queryCoupleNotifications(coupleId: string, userId: string) {
  return db.query.notifications.findMany({
    where: and(
      eq(notifications.coupleId, coupleId),
      eq(notifications.userId, userId),
    ),
    orderBy: [desc(notifications.createdAt)],
    limit: 20,
  });
}

export async function queryCoupleStats(coupleId: string) {
  const allTasks = await db.query.tasks.findMany({
    where: eq(tasks.coupleId, coupleId),
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
