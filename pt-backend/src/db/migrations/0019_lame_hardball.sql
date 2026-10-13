ALTER TABLE "job_descriptions"
ALTER COLUMN "file_size" SET DATA TYPE integer
USING file_size::integer;