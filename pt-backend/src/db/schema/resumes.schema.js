import { pgEnum, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const resumeStatus = pgEnum("resume_status", [
    "UPLOADED",
    "PARSING",
    "PARSED",
    "ANALYZING",
    "COMPLETED",
    "FAILED"
]);

export const resumes = pgTable("resumes", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
    originalName: text("original_name").notNull(),
    storedName: text("stored_name").notNull(),
    mimeType: text("mime_type").notNull(),
    path: text("path").notNull(),
    status: resumeStatus("status").default("UPLOADED").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});
