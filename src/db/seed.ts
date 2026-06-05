import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/neon-http";
import { categories } from "./schema";

const defaultCategories = [
  {
    name: "Sortie romantique",
    slug: "sortie",
    icon: "heart",
    color: "#ff4d8b",
  },
  {
    name: "Date / rendez-vous",
    slug: "date",
    icon: "calendar-heart",
    color: "#b8a4ed",
  },
  {
    name: "Pratique",
    slug: "pratique",
    icon: "check-circle",
    color: "#ffb084",
  },
  {
    name: "Intimité",
    slug: "intimite",
    icon: "sparkles",
    color: "#1a3a3a",
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  for (const category of defaultCategories) {
    await db
      .insert(categories)
      .values(category)
      .onConflictDoNothing({ target: categories.slug });
  }

  console.log("Seed completed.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
