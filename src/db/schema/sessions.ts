import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { sessionRepos } from "./session-repos";

export const sessions = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
  sessionRepos: many(sessionRepos),
}));
