import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { relations } from "drizzle-orm";
import { sessionRepos } from "./session-repos";
import { repoLanguages } from "./repo-languages";

export const repos = pgTable("repos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  ownerAvatar: text("owner_avatar"),
  description: text(),
  language: text(),
  stars: integer(),
  forks: integer(),
  rank: integer().default(0),
  ...timestamps,
});

export const reposRelations = relations(repos, ({ many }) => ({
  sessionRepos: many(sessionRepos),
  repoLanguages: many(repoLanguages),
}));
