CREATE TABLE "session_repos" (
	"session_id" uuid,
	"repo_id" integer,
	CONSTRAINT "session_repos_repo_id_session_id_pk" PRIMARY KEY("repo_id","session_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_repos" ADD CONSTRAINT "session_repos_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_repos" ADD CONSTRAINT "session_repos_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repos" DROP COLUMN "session_id";