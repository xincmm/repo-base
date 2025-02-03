import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { repos } from "./repos";
import { relations } from "drizzle-orm";

export const batchHandles = pgTable("batch_handles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  repoId: integer("repo_id")
    .notNull()
    .references(() => repos.id, { onDelete: "cascade" }),
  batchIndex: integer("batch_index").notNull(),
  batchId: text("batch_id").notNull(),
  accessToken: text("access_token").notNull(),
  status: text("status").notNull(),
});

export const batchHandlesRelations = relations(batchHandles, ({ one }) => ({
  repo: one(repos, {
    references: [repos.id],
    fields: [batchHandles.repoId],
  }),
}));
