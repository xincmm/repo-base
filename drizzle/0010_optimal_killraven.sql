ALTER TABLE "repo_files" DROP CONSTRAINT "repo_files_repo_id_repos_id_fk";
--> statement-breakpoint
ALTER TABLE "repo_files" ADD CONSTRAINT "repo_files_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;