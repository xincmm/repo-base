CREATE TYPE "public"."file_type" AS ENUM('folder', 'file');--> statement-breakpoint
CREATE TABLE "repo_files" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "repo_files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"file_type" "file_type" NOT NULL,
	"path" text NOT NULL,
	"sha" text NOT NULL,
	"url" text NOT NULL,
	"repo_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "repo_files" ADD CONSTRAINT "repo_files_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE no action ON UPDATE no action;