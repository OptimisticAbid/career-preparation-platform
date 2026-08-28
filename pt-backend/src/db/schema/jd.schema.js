import { pgEnum, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import {resumeStatus} from "./resumes.schema.js";

export const jdStatus = pgEnum("jd_status",
    [
        "UPLOADED",
        "PARSING",
        "PARSED",
        "ANALYZING",
        "COMPLETED",
        "FAILED"
    ]
);

export const jd = pgTable("job_descriptions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId : uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    fileName : text("file_name").notNull(),
    filePath : text("file_path").notNull(),
    fileType : text("file_type").notNull(),
    fileSize : text("file_size").notNull(),
    status : jdStatus("status").default("UPLOADED").notNull(),
    uploadedAt : timestamp("uploaded_at").defaultNow().notNull(),
    updatedAt : timestamp("updated_at").defaultNow().notNull()

})