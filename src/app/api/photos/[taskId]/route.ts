import { get } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { taskPhotos } from "@/db/schema";
import { getUserCouple } from "@/lib/couple";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const couple = await getUserCouple(session.user.id);
  if (!couple) {
    return new Response("Forbidden", { status: 403 });
  }

  const { taskId } = await params;

  const photo = await db.query.taskPhotos.findFirst({
    where: eq(taskPhotos.taskId, taskId),
    with: { task: true },
  });

  if (!photo || photo.task.coupleId !== couple.id) {
    return new Response("Not found", { status: 404 });
  }

  const result = await get(photo.blobUrl, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType ?? "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
