import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const jobDescriptions = pgTable("job_descriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    fileName: text("file_name"),
    filePath: text("file_path"),
    fileType: text("file_type"),
    fileSize: integer("file_size"),
    extractedText: text("extracted_text").notNull(),
    structuredData: jsonb("structured_data"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});