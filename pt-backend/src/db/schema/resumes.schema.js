import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const resumes = pgTable("resumes", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    fileName: text("file_name").notNull(),
    filePath: text("file_path").notNull(),
    fileType: text("file_type").notNull(),
    fileSize: integer("file_size").notNull(),
    extractedText: text("extracted_text").notNull(),
    structuredData: jsonb("structured_data"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});