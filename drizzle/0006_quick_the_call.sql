ALTER TABLE "session_repos" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "session_repos" ADD COLUMN "updated_at" timestamp;