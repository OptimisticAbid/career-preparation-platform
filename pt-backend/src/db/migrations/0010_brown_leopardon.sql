CREATE TYPE "public"."employment_type" AS ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'TEMPORARY');--> statement-breakpoint
CREATE TYPE "public"."work_mode" AS ENUM('REMOTE', 'HYBRID', 'ONSITE');--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" RENAME COLUMN "job_title" TO "job_titles";--> statement-breakpoint
ALTER TABLE "job_descriptions" ALTER COLUMN "file_size" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" ADD COLUMN "employment_type" "employment_type";--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" ADD COLUMN "work_mode" "work_mode";