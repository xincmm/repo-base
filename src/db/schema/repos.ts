import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { relations } from "drizzle-orm";
import { sessionRepos } from "./session-repos";
import { repoLanguages } from "./repo-languages";
import { repoFiles } from "./repo-files";

export const docsProcessingStatus = pgEnum("docs_processing_status_enum", [
  "not_started",
  "triggered",
  "processed",
]);

export const repos = pgTable("repos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  ownerAvatar: text("owner_avatar"),
  description: text(),
  language: text(),
  stars: integer(),
  forks: integer(),
  rank: integer().default(0),

  licenseName: text(),
  licenseUrl: text(),
  ...timestamps,

  docsProcessingStatus: docsProcessingStatus("docs_processing_status"),
});

export const reposRelations = relations(repos, ({ many }) => ({
  sessionRepos: many(sessionRepos),
  repoLanguages: many(repoLanguages),
  repoFiles: many(repoFiles),
}));
