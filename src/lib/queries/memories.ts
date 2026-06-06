import { and, count, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories, taskPhotos, tasks } from "@/db/schema";

export const MEMORY_PAGE_SIZE = 24;

export type MemoryPhotoItem = {
  id: string;
  title: string;
  completedAt: Date | null;
  category: {
    name: string;
    slug: string;
  };
  photo: {
    blobUrl: string;
  };
};

export async function queryMemoryPhotos(
  coupleId: string,
  options?: { page?: number; limit?: number },
): Promise<MemoryPhotoItem[]> {
  const limit = options?.limit ?? MEMORY_PAGE_SIZE;
  const page = options?.page ?? 1;
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      completedAt: tasks.completedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      blobUrl: taskPhotos.blobUrl,
    })
    .from(tasks)
    .innerJoin(taskPhotos, eq(tasks.id, taskPhotos.taskId))
    .innerJoin(categories, eq(tasks.categoryId, categories.id))
    .where(and(eq(tasks.coupleId, coupleId), eq(tasks.status, "done")))
    .orderBy(desc(tasks.completedAt))
    .limit(limit)
    .offset(offset);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    completedAt: row.completedAt,
    category: { name: row.categoryName, slug: row.categorySlug },
    photo: { blobUrl: row.blobUrl },
  }));
}

export async function queryMemoryPhotosCount(coupleId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(tasks)
    .innerJoin(taskPhotos, eq(tasks.id, taskPhotos.taskId))
    .where(and(eq(tasks.coupleId, coupleId), eq(tasks.status, "done")));

  return result?.count ?? 0;
}

export async function getCachedMemoryPhotos(coupleId: string, page: number) {
  "use cache";
  cacheTag(`memories-${coupleId}`);
  cacheLife("hours");

  const [items, total] = await Promise.all([
    queryMemoryPhotos(coupleId, { page, limit: MEMORY_PAGE_SIZE }),
    queryMemoryPhotosCount(coupleId),
  ]);

  return { items, total, page, pageSize: MEMORY_PAGE_SIZE };
}
