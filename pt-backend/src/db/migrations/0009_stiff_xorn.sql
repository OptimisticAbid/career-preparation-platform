CREATE TABLE "jd_analysis_schema" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jd_id" uuid NOT NULL,
	"job_title" text NOT NULL,
	"job_description" text NOT NULL,
	"required_skills" jsonb,
	"experience_requirements" text,
	"education_requirements" text,
	"job_responsibilities" jsonb,
	"qualifications" jsonb,
	CONSTRAINT "jd_analysis_schema_jd_id_unique" UNIQUE("jd_id")
);
--> statement-breakpoint
ALTER TABLE "jd_analysis_schema" ADD CONSTRAINT "jd_analysis_schema_jd_id_job_descriptions_id_fk" FOREIGN KEY ("jd_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade ON UPDATE no action;