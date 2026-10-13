CREATE TABLE "matching_schema" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jd_id" uuid NOT NULL,
	"resume_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"overall_score" integer NOT NULL,
	"breakdown" jsonb NOT NULL,
	"skill_analysis" jsonb NOT NULL,
	"gaps" jsonb NOT NULL,
	"role_matches" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "matching_schema_resume_jd_unique" UNIQUE("resume_id","jd_id")
);
--> statement-breakpoint
ALTER TABLE "matching_schema" ADD CONSTRAINT "matching_schema_jd_id_job_descriptions_id_fk" FOREIGN KEY ("jd_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matching_schema" ADD CONSTRAINT "matching_schema_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matching_schema" ADD CONSTRAINT "matching_schema_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;