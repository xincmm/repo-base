ALTER TABLE "repo_tasks" DROP CONSTRAINT "repo_tasks_repo_id_repos_id_fk";
--> statement-breakpoint
ALTER TABLE "repo_tasks" ADD CONSTRAINT "repo_tasks_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;