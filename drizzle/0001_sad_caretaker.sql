CREATE TYPE "public"."docs_processing_status_enum" AS ENUM('triggered', 'processed');--> statement-breakpoint
ALTER TABLE "repos" ADD COLUMN "docs_processing_status" "docs_processing_status_enum";