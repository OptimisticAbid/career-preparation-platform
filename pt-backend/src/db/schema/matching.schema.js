import {
    pgTable,
    uuid,
    integer,
    jsonb,
    text,
    timestamp,
    check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { users } from "./users.schema.js";
import { resumes } from "./resumes.schema.js";
import { jobDescriptions } from "./jobDescriptions.schema.js";


export const matches = pgTable("matches", {

    id: uuid("id")
        .primaryKey()
        .defaultRandom(),

    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),

    resumeId: uuid("resume_id")
        .notNull()
        .references(() => resumes.id, {
            onDelete: "cascade",
        }),

    // NULL when the user provides a JD directly as text
    jdId: uuid("jd_id")
        .references(() => jobDescriptions.id, {
            onDelete: "cascade",
        }),

    // Used when the user matches against a JD
    // that isn't stored in jobDescriptions.
    jdText: text("jd_text"),

    overallScore: integer("overall_score")
        .notNull(),

    matchResult: jsonb("match_result")
        .notNull(),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),

}, (table) => [

    check(
        "matches_jd_source_check",
        sql`(
            (${table.jdId} IS NOT NULL AND ${table.jdText} IS NULL)
            OR
            (${table.jdId} IS NULL AND ${table.jdText} IS NOT NULL)
        )`
    ),

]);