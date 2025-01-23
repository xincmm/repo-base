CREATE TABLE "repos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "repos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"owner_avatar" text,
	"description" text,
	"language" text,
	"stars" integer,
	"forks" integer,
	"session_id" uuid,
	CONSTRAINT "repos_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "repos_name_idx" ON "repos" USING btree ("name");