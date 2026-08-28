import { boolean, integer, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const problems = pgTable("problems", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    problemName: varchar("problem_name", { length: 255 }).notNull(),
    sourceProblemId: varchar("source_problem_id", { length: 255 }).notNull(),
    difficulty: integer("difficulty").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    platform: varchar("platform", { length: 100 }),
    platformUrl: text("platform_url"),
    pattern: varchar("pattern", { length: 255 }),
    notes: text("notes"),
    needsRevison: boolean("needs_revision").default(false),
    solvedAt: timestamp("solved_at"),
    timeTaken: integer("time_taken"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => ({
    userPlatformSourceProblemIdUnique: unique("problems_user_id_platform_source_problem_id_unique")
        .on(table.userId, table.platform, table.sourceProblemId)
}));