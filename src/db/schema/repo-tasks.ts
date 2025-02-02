import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { repos } from "./repos";
import { relations } from "drizzle-orm";

export const repoTasks = pgTable("repo_tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  taskId: text("task_id").notNull(),
  runId: text("run_id").notNull(),
  taskToken: text("task_token").notNull(),
  repoId: integer("repo_id")
    .references(() => repos.id, {
      onDelete: "cascade",
    })
    .notNull(),
  ...timestamps,
});

export const repoTasksRelations = relations(repoTasks, ({ one }) => ({
  repo: one(repos, {
    references: [repos.id],
    fields: [repoTasks.repoId],
  }),
}));
