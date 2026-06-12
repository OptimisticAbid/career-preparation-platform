ALTER TABLE "problems" ALTER COLUMN "difficulty" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "difficulty" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "pattern" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "solved_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "time_taken" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "problems" ADD COLUMN "platform" varchar(100);--> statement-breakpoint
ALTER TABLE "problems" ADD COLUMN "platform_url" text;--> statement-breakpoint
ALTER TABLE "problems" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;