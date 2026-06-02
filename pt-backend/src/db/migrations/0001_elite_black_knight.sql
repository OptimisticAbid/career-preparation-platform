CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"difficulty" text,
	"status" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"pattern" varchar,
	"notes" text,
	"needs_revision" boolean DEFAULT false,
	"solved_at" integer,
	"time_taken" timestamp
);
--> statement-breakpoint
DROP TABLE "problem" CASCADE;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;