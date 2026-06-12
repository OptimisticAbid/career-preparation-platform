ALTER TABLE "problems" ADD COLUMN "platform" varchar(100);
ALTER TABLE "problems" ADD COLUMN "platform_url" text;
ALTER TABLE "problems" ADD COLUMN "updated_at" timestamp DEFAULT NOW();

