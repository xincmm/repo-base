import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { repos } from "./repos";
import { relations } from "drizzle-orm";

export const fileType = pgEnum("file_type", ["folder", "file"]);

export const repoFiles = pgTable("repo_files", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fileType: fileType("file_type"),
  path: text().notNull(),
  sha: text(),
  url: text(),
  repoId: integer("repo_id")
    .references(() => repos.id, {
      onDelete: "cascade",
    })
    .notNull(),
  content: text(),
  ...timestamps,
});

export const repoFilesRelations = relations(repoFiles, ({ one }) => ({
  repo: one(repos, {
    references: [repos.id],
    fields: [repoFiles.repoId],
  }),
}));

export type RepoFile = typeof repoFiles.$inferSelect;
