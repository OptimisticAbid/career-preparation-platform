CREATE TYPE "public"."document_type" AS ENUM('RESUME', 'JD');
--> statement-breakpoint
CREATE TABLE "documents" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "type" "document_type" NOT NULL,
    "file_name" text NOT NULL,
    "file_path" text NOT NULL,
    "file_type" text NOT NULL,
    "file_size" text NOT NULL,
    "extracted_text" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
INSERT INTO "documents" (
    "id", "user_id", "type", "file_name", "file_path", "file_type", "file_size",
    "extracted_text", "created_at", "updated_at"
)
SELECT
    resume."id",
    resume."user_id",
    'RESUME',
    resume."file_name",
    resume."file_path",
    resume."file_type",
    resume."file_size",
    COALESCE(content."extracted_text", ''),
    resume."uploaded_at",
    resume."updated_at"
FROM "resumes" AS resume
LEFT JOIN LATERAL (
    SELECT "extracted_text"
    FROM "resume_contents"
    WHERE "resume_id" = resume."id"
    ORDER BY "created_at" DESC
    LIMIT 1
) AS content ON true;
--> statement-breakpoint
CREATE INDEX "documents_user_type_created_idx" ON "documents" ("user_id", "type", "created_at" DESC);
--> statement-breakpoint
ALTER TABLE "matching_schema" ADD COLUMN "jd_id" uuid;
--> statement-breakpoint
ALTER TABLE "matching_schema" ALTER COLUMN "jd_text" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "matching_schema" DROP CONSTRAINT IF EXISTS "matching_schema_resume_id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "matching_schema" ADD CONSTRAINT "matching_schema_resume_id_documents_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "matching_schema" ADD CONSTRAINT "matching_schema_jd_id_documents_id_fk" FOREIGN KEY ("jd_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "matching_schema" ADD CONSTRAINT "matching_schema_jd_source_check" CHECK (
    ("jd_id" IS NOT NULL AND "jd_text" IS NULL)
    OR ("jd_id" IS NULL AND "jd_text" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "resume_analysis" DROP CONSTRAINT IF EXISTS "resume_analysis_resume_id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "resume_analysis" ADD CONSTRAINT "resume_analysis_resume_id_documents_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
DROP TABLE "resume_contents";
--> statement-breakpoint
DROP TABLE "resumes";
--> statement-breakpoint
DROP TYPE "public"."resume_status";
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."jd_status";
