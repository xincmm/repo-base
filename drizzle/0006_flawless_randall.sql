CREATE TABLE "batch_handles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "batch_handles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"repo_id" integer NOT NULL,
	"batch_index" integer NOT NULL,
	"batch_id" text NOT NULL,
	"access_token" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "repo_files" ALTER COLUMN "path" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "batch_handles" ADD CONSTRAINT "batch_handles_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;