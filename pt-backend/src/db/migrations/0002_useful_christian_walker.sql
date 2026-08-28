CREATE TYPE "public"."jd_status" AS ENUM('UPLOADED', 'PARSING', 'PARSED', 'ANALYZING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TABLE "job_descriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" text NOT NULL,
	"status" "jd_status" DEFAULT 'UPLOADED' NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "original_name" TO "file_name";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "mime_type" TO "file_type";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "created_at" TO "uploaded_at";--> statement-breakpoint
ALTER TABLE "resumes" DROP CONSTRAINT "resumes_user_id_unique";--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "file_path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "file_size" text NOT NULL;--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" DROP COLUMN "stored_name";--> statement-breakpoint
ALTER TABLE "resumes" DROP COLUMN "path";