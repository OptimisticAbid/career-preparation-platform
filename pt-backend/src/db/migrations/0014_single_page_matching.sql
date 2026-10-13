ALTER TABLE "matching_schema" ADD COLUMN "jd_text" text;
--> statement-breakpoint
ALTER TABLE "matching_schema" ADD COLUMN "match_result" jsonb;
--> statement-breakpoint
UPDATE "matching_schema" AS match
SET
    "jd_text" = COALESCE((
        SELECT content."extracted_text"
        FROM "jd_contents" AS content
        WHERE content."jd_id" = match."jd_id"
        ORDER BY content."created_at" DESC
        LIMIT 1
    ), ''),
    "match_result" = jsonb_build_object(
        'overall_score', match."overall_score",
        'breakdown', match."breakdown",
        'skill_analysis', match."skill_analysis",
        'gaps', match."gaps",
        'legacy', true
    );
--> statement-breakpoint
ALTER TABLE "matching_schema" ALTER COLUMN "jd_text" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "matching_schema" ALTER COLUMN "match_result" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "matching_schema" ALTER COLUMN "jd_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "matching_schema" DROP CONSTRAINT "matching_schema_resume_jd_unique";
