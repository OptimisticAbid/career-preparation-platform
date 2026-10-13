CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"resume_id" uuid NOT NULL,
	"jd_id" uuid,
	"jd_text" text,
	"overall_score" integer NOT NULL,
	"match_result" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "matches_jd_source_check" CHECK ((
            ("matches"."jd_id" IS NOT NULL AND "matches"."jd_text" IS NULL)
            OR
            ("matches"."jd_id" IS NULL AND "matches"."jd_text" IS NOT NULL)
        ))
);
--> statement-breakpoint
ALTER TABLE "matching_schema" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "jd_contents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "resume_analysis" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "resume_contents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "matching_schema" CASCADE;--> statement-breakpoint
DROP TABLE "jd_contents" CASCADE;--> statement-breakpoint
DROP TABLE "jd_analysis_schema" CASCADE;--> statement-breakpoint
DROP TABLE "resume_analysis" CASCADE;--> statement-breakpoint
DROP TABLE "resume_contents" CASCADE;--> statement-breakpoint
ALTER TABLE "job_descriptions" ALTER COLUMN "file_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_descriptions" ALTER COLUMN "file_path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_descriptions" ALTER COLUMN "file_type" DROP NOT NULL;--> statement-breakpoint

ALTER TABLE "job_descriptions"
ALTER COLUMN "file_size" SET DATA TYPE integer
USING file_size::integer;--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD COLUMN "extracted_text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD COLUMN "structured_data" jsonb;--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "extracted_text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "structured_data" jsonb;--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_jd_id_job_descriptions_id_fk" FOREIGN KEY ("jd_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_descriptions" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "job_descriptions" DROP COLUMN "uploaded_at";--> statement-breakpoint
ALTER TABLE "resumes" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "resumes" DROP COLUMN "uploaded_at";--> statement-breakpoint
DROP TYPE "public"."jd_status";--> statement-breakpoint
DROP TYPE "public"."resume_status";