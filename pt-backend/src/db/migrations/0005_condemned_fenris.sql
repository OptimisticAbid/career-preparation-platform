CREATE TABLE "jd_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jd_id" uuid NOT NULL,
	"extracted_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jd_contents" ADD CONSTRAINT "jd_contents_jd_id_job_descriptions_id_fk" FOREIGN KEY ("jd_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade ON UPDATE no action;