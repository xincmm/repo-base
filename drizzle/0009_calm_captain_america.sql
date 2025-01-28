ALTER TABLE "repo_files" ALTER COLUMN "file_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "repo_files" ALTER COLUMN "path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "repo_files" ALTER COLUMN "sha" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "repo_files" ALTER COLUMN "url" DROP NOT NULL;