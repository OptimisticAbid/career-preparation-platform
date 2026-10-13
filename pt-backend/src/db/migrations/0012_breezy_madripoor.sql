ALTER TABLE "jd_analysis_schema" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DROP COLUMN "job_description";--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DROP COLUMN "required_skills";--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DROP COLUMN "experience_requirements";--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DROP COLUMN "education_requirements";--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DROP COLUMN "job_responsibilities";--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DROP COLUMN "qualifications";--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DROP COLUMN "employment_type";--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" DROP COLUMN "work_mode";--> statement-breakpoint
DROP TYPE "public"."employment_type";--> statement-breakpoint
DROP TYPE "public"."work_mode";