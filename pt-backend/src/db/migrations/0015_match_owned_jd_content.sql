ALTER TABLE "matching_schema"
    DROP CONSTRAINT IF EXISTS "matching_schema_jd_id_job_descriptions_id_fk";
--> statement-breakpoint
ALTER TABLE "matching_schema" DROP COLUMN IF EXISTS "jd_id";
--> statement-breakpoint
DROP TABLE IF EXISTS "jd_analysis_schema";
--> statement-breakpoint
DROP TABLE IF EXISTS "jd_contents";
--> statement-breakpoint
DROP TABLE IF EXISTS "job_descriptions";