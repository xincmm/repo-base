import { relations } from "drizzle-orm";
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { repos } from "./repos";

export const repoLanguages = pgTable("repo_languages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  language: text().notNull(),
  bytes: integer().notNull(),
  repoId: integer().references(() => repos.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const repoLanguagesRelations = relations(repoLanguages, ({ one }) => ({
  repo: one(repos, {
    references: [repos.id],
    fields: [repoLanguages.repoId],
  }),
}));
