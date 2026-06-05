import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
]);

export const taskAssigneeEnum = pgEnum("task_assignee", [
  "me",
  "partner",
  "both",
]);

export const coupleRoleEnum = pgEnum("couple_role", ["owner", "member"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const couples = pgTable("couple", {
  id: uuid("id").defaultRandom().primaryKey(),
  inviteCode: text("inviteCode").notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const coupleMembers = pgTable(
  "couple_member",
  {
    coupleId: uuid("coupleId")
      .notNull()
      .references(() => couples.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: coupleRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joinedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.coupleId, t.userId] }),
  }),
);

export const coupleInvitations = pgTable("couple_invitation", {
  id: uuid("id").defaultRandom().primaryKey(),
  coupleId: uuid("coupleId")
    .notNull()
    .references(() => couples.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  createdBy: text("createdBy")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  revokedAt: timestamp("revokedAt", { mode: "date" }),
  usedAt: timestamp("usedAt", { mode: "date" }),
  usedBy: text("usedBy").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const categories = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const tasks = pgTable("task", {
  id: uuid("id").defaultRandom().primaryKey(),
  coupleId: uuid("coupleId")
    .notNull()
    .references(() => couples.id, { onDelete: "cascade" }),
  createdBy: text("createdBy")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => categories.id),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("todo"),
  assignee: taskAssigneeEnum("assignee").notNull().default("both"),
  dueAt: timestamp("dueAt", { mode: "date" }),
  completedAt: timestamp("completedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const taskPhotos = pgTable("task_photo", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("taskId")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  blobUrl: text("blobUrl").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const taskLocations = pgTable("task_location", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("taskId")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" })
    .unique(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  label: text("label"),
});

export const notifications = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  coupleId: uuid("coupleId")
    .notNull()
    .references(() => couples.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  coupleMembers: many(coupleMembers),
  coupleInvitations: many(coupleInvitations),
  tasks: many(tasks),
  notifications: many(notifications),
}));

export const couplesRelations = relations(couples, ({ many }) => ({
  members: many(coupleMembers),
  invitations: many(coupleInvitations),
  tasks: many(tasks),
  notifications: many(notifications),
}));

export const coupleInvitationsRelations = relations(
  coupleInvitations,
  ({ one }) => ({
    couple: one(couples, {
      fields: [coupleInvitations.coupleId],
      references: [couples.id],
    }),
    creator: one(users, {
      fields: [coupleInvitations.createdBy],
      references: [users.id],
    }),
  }),
);

export const coupleMembersRelations = relations(coupleMembers, ({ one }) => ({
  couple: one(couples, {
    fields: [coupleMembers.coupleId],
    references: [couples.id],
  }),
  user: one(users, {
    fields: [coupleMembers.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tasks: many(tasks),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  couple: one(couples, {
    fields: [notifications.coupleId],
    references: [couples.id],
  }),
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const taskPhotosRelations = relations(taskPhotos, ({ one }) => ({
  task: one(tasks, {
    fields: [taskPhotos.taskId],
    references: [tasks.id],
  }),
}));

export const taskLocationsRelations = relations(taskLocations, ({ one }) => ({
  task: one(tasks, {
    fields: [taskLocations.taskId],
    references: [tasks.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
  photo: one(taskPhotos, {
    fields: [tasks.id],
    references: [taskPhotos.taskId],
  }),
  location: one(taskLocations, {
    fields: [tasks.id],
    references: [taskLocations.taskId],
  }),
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
  }),
}));
