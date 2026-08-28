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
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    fileName : text("file_name").notNull(),
    filePath : text("file_path").notNull(),
    fileType : text("file_type").notNull(),
    fileSize : text("file_size").notNull(),
    status: resumeStatus("status").default("UPLOADED").notNull(),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});
