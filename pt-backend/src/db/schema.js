import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { db } from "./db.js";


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    email: varchar("email",{ length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
    
})

export const problems = pgTable("problems", {
    id : uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    problemName: varchar("name", {length: 255}).notNull(),
    difficulty: text("difficulty"),
    status: text("status"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    pattern: varchar("pattern", {length: 255}),
    notes: text("notes"),
    needsRevison: boolean("needs_revision").default(false),
    solvedAt: integer("solved_at"),
    timeTaken: integer("time_taken")
})