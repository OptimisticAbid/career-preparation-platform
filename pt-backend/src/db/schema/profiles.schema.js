import { pgTable, serial, text, integer, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
    leetcodeUsername: text("leetcode_username"),
    githubUsername: text("github_username"),
    codeforcesUsername: text("codeforces_username"),
    codechefUsername: text("codechef_username"),
    createdAt: text("created_at").defaultNow().notNull(),
    updatedAt: text("updated_at").defaultNow().notNull()
});
