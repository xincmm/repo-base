import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { sessions } from "./sessions";
import { repos } from "./repos";
import { relations } from "drizzle-orm";
import { timestamps } from "../utils";

export const sessionRepos = pgTable(
  "session_repos",
  {
    sessionId: uuid("session_id").references(() => sessions.id, {
      onDelete: "cascade",
    }),
    repoId: integer("repo_id").references(() => repos.id, {
      onDelete: "cascade",
    }),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.repoId, t.sessionId] })],
);

export const sessionReposRelations = relations(sessionRepos, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionRepos.sessionId],
    references: [sessions.id],
  }),
  repo: one(repos, {
    fields: [sessionRepos.repoId],
    references: [repos.id],
  }),
}));
