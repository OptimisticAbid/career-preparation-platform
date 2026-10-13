CREATE TABLE "resumes" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE cascade,
    "file_name" text NOT NULL,
    "file_path" text NOT NULL,
    "file_type" text NOT NULL,
    "file_size" integer NOT NULL,
    "extracted_text" text NOT NULL,
    "structured_data" jsonb,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_descriptions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE cascade,
    "file_name" text,
    "file_path" text,
    "file_type" text,
    "file_size" text,
    "extracted_text" text NOT NULL,
    "structured_data" jsonb,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "resumes" (
    "id", "user_id", "file_name", "file_path", "file_type", "file_size",
    "extracted_text", "structured_data", "created_at", "updated_at"
)
SELECT
    document.id,
    document.user_id,
    document.file_name,
    document.file_path,
    document.file_type,
    CASE WHEN document.file_size ~ '^[0-9]+$' THEN document.file_size::integer ELSE 0 END,
    document.extracted_text,
    CASE WHEN analysis.resume_id IS NULL THEN NULL ELSE jsonb_strip_nulls(jsonb_build_object(
        'summary', analysis.summary,
        'skills', analysis.skills,
        'experience', analysis.experience,
        'education', analysis.education,
        'projects', analysis.projects,
        'certifications', analysis.certifications,
        'achievements', analysis.achievements
    )) END,
    document.created_at,
    document.updated_at
FROM "documents" AS document
LEFT JOIN "resume_analysis" AS analysis ON analysis.resume_id = document.id
WHERE document.type = 'RESUME';
--> statement-breakpoint
INSERT INTO "job_descriptions" (
    "id", "user_id", "file_name", "file_path", "file_type", "file_size",
    "extracted_text", "created_at", "updated_at"
)
SELECT
    id, user_id, file_name, file_path, file_type, file_size,
    extracted_text, created_at, updated_at
FROM "documents"
WHERE type = 'JD';
--> statement-breakpoint
ALTER TABLE "matching_schema" DROP CONSTRAINT IF EXISTS "matching_schema_resume_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "matching_schema" DROP CONSTRAINT IF EXISTS "matching_schema_jd_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "matching_schema" ADD CONSTRAINT "matching_schema_resume_id_resumes_id_fk"
    FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade;
--> statement-breakpoint
ALTER TABLE "matching_schema" ADD CONSTRAINT "matching_schema_jd_id_job_descriptions_id_fk"
    FOREIGN KEY ("jd_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade;
--> statement-breakpoint
DROP TABLE IF EXISTS "resume_analysis";
--> statement-breakpoint
DROP TABLE "documents";
--> statement-breakpoint
DROP TYPE "public"."document_type";