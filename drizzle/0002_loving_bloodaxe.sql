ALTER TABLE "repos" ADD COLUMN "rank" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "repos" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "repos" ADD COLUMN "updated_at" timestamp;