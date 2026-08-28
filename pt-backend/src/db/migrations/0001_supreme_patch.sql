ALTER TABLE "problems" RENAME COLUMN "name" TO "problem_name";--> statement-breakpoint
ALTER TABLE "problems" ADD COLUMN "source_problem_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_user_id_platform_source_problem_id_unique" UNIQUE("user_id","platform","source_problem_id");